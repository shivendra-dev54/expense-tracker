import { dbConnect } from "@/db";
import { EntryBook, IEntryBook } from "@/db/schemas/entrybook.schema"
import { Expense } from "@/db/schemas/expense.schema";
import { InvalidDataError, NotFoundError, UnauthorizedError } from "@/util/customErrors";

// desc: this will create a book
export const createBookService = async (book_info: Pick<IEntryBook, "name" | "user_id">) => {
  await dbConnect();
  const name = book_info.name;
  const user_id = book_info.user_id;

  if (!name) {
    throw new InvalidDataError("provided book name is invalid!");
  }

  const book_with_same_name = await EntryBook.findOne({
    user_id,
    name
  });

  if (book_with_same_name) {
    throw new InvalidDataError("book with this name already exist!");
  }

  const new_book: IEntryBook = {
    name,
    user_id,
    balance: 0
  };

  const saved_book = await EntryBook.create(new_book);
  return saved_book;
}

// desc: this func will update name of the book
export const updateBookService = async (_id: string, new_name: string, user_id: string) => {
  await dbConnect();
  const book_to_be_updated = await EntryBook.findOne({ _id, user_id });

  if (!book_to_be_updated) {
    throw new NotFoundError();
  }
  if (book_to_be_updated.name.trim() === "me") {
    throw new UnauthorizedError();
  }
  if (!new_name) {
    throw new InvalidDataError("new name cannot be empty.");
  }

  book_to_be_updated.name = new_name;
  await book_to_be_updated.save();

  return book_to_be_updated;
}

// desc: this func will return all the books of a user
export const readBookService = async (user_id: string) => {
  const books_owned_by_user = await EntryBook.find({ user_id });
  return books_owned_by_user;
}

// desc: this func will delete the expenses in that particular book as well
export const deleteBookService = async (_id: string, user_id: string) => {
  await dbConnect();
  await Expense.deleteMany({ entrybook_id: _id });
  const deleted_book = await EntryBook.findOneAndDelete({ _id, user_id });
  return deleted_book;
}

// desc: this is specifically for the balance update so no validation thing
export const updateBookBalanceService = async (_id: string, updated_balance: number, user_id: string) => {
  const updated_book = await EntryBook.findOneAndUpdate(
    { _id, user_id },
    { balance: updated_balance }
  );
  return updated_book;
}