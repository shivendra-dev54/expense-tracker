import { dbConnect } from "@/db";
import { EntryBook } from "@/db/schemas/entrybook.schema";
import { Expense, IExpense } from "@/db/schemas/expense.schema";
import { InvalidDataError, NotFoundError } from "@/util/customErrors"
import mongoose from "mongoose";
import { Types } from "mongoose";

export const createExpenseService = async (
  user_id: Types.ObjectId,
  book_id: string,
  amount: number,
  message: string,
  expense_date: Date
) => {
  if (!book_id || !Number.isFinite(amount) || amount === 0 || !expense_date || isNaN(expense_date.getTime())) {
    throw new InvalidDataError();
  }

  await dbConnect();

  const session = await mongoose.startSession();

  let new_exp;

  try {
    await session.withTransaction(async () => {
      const book = await EntryBook.findOne({
        _id: book_id,
        user_id
      }).session(session);

      if (!book) {
        throw new NotFoundError();
      }

      const data: IExpense = {
        entrybook_id: book._id,
        user_id,
        amount,
        message,
        expense_date
      };

      [new_exp] = await Expense.create([data], { session });

      book.balance += amount;
      await book.save({ session });
    });
  }
  finally {
    await session.endSession();
  }

  return new_exp;
};


// desc: this will read all the expenses in a book and will return it
export const readExpenseService = async (
  book_id: Types.ObjectId,
  user_id: Types.ObjectId
) => {
  await dbConnect();
  const book_from_db = await EntryBook.findOne({
    _id: book_id,
    user_id
  });

  if (!book_from_db) {
    throw new NotFoundError();
  }

  const expenses_in_book: IExpense[] | null = await Expense.find({
    user_id,
    entrybook_id: book_from_db._id
  });

  return {
    book: book_from_db,
    expenses: expenses_in_book
  };
}


// desc: this func will update a certain expense
export const updateExpenseService = async (
  user_id: Types.ObjectId,
  expense_id: Types.ObjectId,
  updates: {
    amount?: number;
    message?: string;
    expense_date?: Date;
  }
) => {
  await dbConnect();

  const session = await mongoose.startSession();

  let updated_exp;

  try {
    await session.withTransaction(async () => {
      const expense = await Expense.findOne({
        user_id,
        _id: expense_id
      }).session(session);

      if (!expense) {
        throw new NotFoundError();
      }

      // Update balance only if amount changes
      if (updates.amount !== undefined) {
        if (!Number.isFinite(updates.amount) || updates.amount === 0) {
          throw new InvalidDataError();
        }

        const book = await EntryBook.findOne({
          _id: expense.entrybook_id,
          user_id
        }).session(session);

        if (!book) {
          throw new NotFoundError();
        }

        book.balance += updates.amount - expense.amount;
        await book.save({ session });

        expense.amount = updates.amount;
      }

      if (updates.message !== undefined) {
        expense.message = updates.message;
      }

      if (updates.expense_date !== undefined) {
        if (isNaN(updates.expense_date.getTime())) {
          throw new InvalidDataError();
        }

        expense.expense_date = updates.expense_date;
      }

      updated_exp = await expense.save({ session });
    });
  }
  finally {
    await session.endSession();
  }

  return updated_exp;
};


export const deleteExpenseService = async (
  user_id: Types.ObjectId,
  expense_id: Types.ObjectId
) => {
  await dbConnect();

  const session = await mongoose.startSession();

  let deletedExpense;

  try {
    await session.withTransaction(async () => {
      const expense = await Expense.findOne({
        user_id,
        _id: expense_id
      }).session(session);

      if (!expense) {
        throw new NotFoundError();
      }

      const book = await EntryBook.findOne({
        _id: expense.entrybook_id,
        user_id
      }).session(session);

      if (!book) {
        throw new NotFoundError();
      }

      await Expense.deleteOne(
        {
          _id: expense_id,
          user_id
        },
        { session }
      );

      book.balance -= expense.amount;
      await book.save({ session });

      deletedExpense = expense;
    });
  } finally {
    await session.endSession();
  }

  return deletedExpense;
};



export const bulkDeleteExpenseService = async (
  user_id: Types.ObjectId,
  book_id: string,
  expense_ids: string[]
) => {
  if (
    !book_id ||
    !Types.ObjectId.isValid(book_id) ||
    !Array.isArray(expense_ids) ||
    expense_ids.length === 0 ||
    expense_ids.some((id) => !Types.ObjectId.isValid(id))
  ) {
    throw new InvalidDataError();
  }

  const uniqueIds = [...new Set(expense_ids)];

  if (uniqueIds.length !== expense_ids.length) {
    throw new InvalidDataError();
  }

  await dbConnect();

  const session = await mongoose.startSession();

  let result;

  try {
    await session.withTransaction(async () => {
      const book = await EntryBook.findOne({
        _id: book_id,
        user_id
      }).session(session);

      if (!book) {
        throw new NotFoundError();
      }

      const expenses = await Expense.find({
        _id: { $in: uniqueIds },
        user_id,
        entrybook_id: book._id
      }).session(session);

      // Reject the entire operation if even one selected expense
      // doesn't belong to this user and book, or no longer exists.
      if (expenses.length !== uniqueIds.length) {
        throw new NotFoundError();
      }

      const totalAmount = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );

      const deletedIds = expenses.map((expense) => expense._id.toString());

      const deleteResult = await Expense.deleteMany(
        {
          _id: { $in: uniqueIds },
          user_id,
          entrybook_id: book._id
        },
        { session }
      );

      if (deleteResult.deletedCount !== uniqueIds.length) {
        throw new Error("Bulk deletion failed.");
      }

      book.balance -= totalAmount;
      await book.save({ session });

      result = {
        deleted_count: deleteResult.deletedCount,
        deleted_ids: deletedIds,
        balance: book.balance
      };
    });
  } finally {
    await session.endSession();
  }

  return result;
};
