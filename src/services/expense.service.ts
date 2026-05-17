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
  message: string
) => {
  if ((!book_id && !amount) || amount === 0.0) {
    throw new InvalidDataError();
  }

  await dbConnect();
  const session = await mongoose.startSession();
  let new_exp;
  try {
    await session.withTransaction(async () => {
      // check if book exist and owned by user
      const book = await EntryBook.findOne({ "user_id": user_id, "_id": book_id }).session(session);
      if (!book) {
        throw new NotFoundError();
      }

      // create new expense
      const data: IExpense = {
        entrybook_id: book._id,
        user_id,
        amount,
        message
      };
      [new_exp] = await Expense.create([data], { session });

      // update the balance in book
      book.balance += amount;
      await book.save({ session });
    });
  }
  finally {
    await session.endSession();
  }
  return new_exp;
}


// desc: this will read all the expenses in a book and will return it
export const readExpenseService = async (
  book_id: Types.ObjectId,
  user_id: Types.ObjectId
) => {
  await dbConnect();
  const book_from_db = await EntryBook.findOne({
    _id: book_id,
    user_id: user_id
  });

  if (!book_from_db) {
    throw new NotFoundError();
  }

  const expenses_in_book: IExpense[] | null = await Expense.find({
    user_id,
    entrybook_id: book_from_db._id
  });

  book_from_db.expenses = expenses_in_book;
  return book_from_db;
}


// desc: this func will update a certain expense
export const updateExpenseMessageService = async (
  user_id: Types.ObjectId,
  expense_id: Types.ObjectId,
  message: string
) => {
  await dbConnect();
  const expense = await Expense.findOne({
    user_id,
    _id: expense_id
  });

  if (!expense) {
    throw new NotFoundError();
  }

  expense.message = message;
  await expense.save();

  return expense;
}


// desc: this func will update the amount of expense
export const updateExpenseAmountService = async (
  user_id: Types.ObjectId,
  expense_id: Types.ObjectId,
  new_amount: number
) => {
  await dbConnect();

  const session = await mongoose.startSession();

  let expense;
  try {
    session.withTransaction(async () => {
      expense = await Expense.findOne({
        user_id,
        _id: expense_id
      });

      if (!expense) {
        throw new NotFoundError();
      }
      const old_amt: number = expense.amount;
      expense.amount = new_amount;
      await expense.save();


      // balance update
      const book = await EntryBook.findById(expense.entrybook_id);
      book.balance -= old_amt;
      book.balance += new_amount;
      await book.save();
    });
  }
  finally {
    await session.endSession();
  }
  return expense;
}


export const deleteExpenseService = async (
  user_id: Types.ObjectId,
  expense_id: Types.ObjectId
) => {
  await dbConnect();
  const expense = await Expense.findOneAndDelete({
    _id: expense_id,
    user_id
  });

  if (!expense) {
    throw new NotFoundError();
  }
  return expense;
}