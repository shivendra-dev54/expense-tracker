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

  let expense;
  try {
    await session.withTransaction(async () => {
      expense = await Expense.findOneAndDelete({
        user_id,
        _id: expense_id
      });

      if (!expense) {
        throw new NotFoundError();
      }

      // balance update
      const book = await EntryBook.findById(expense.entrybook_id);
      book.balance -= parseInt(expense.amount);
      await book.save();
    });
  }
  finally {
    await session.endSession();
  }
  return expense;
}