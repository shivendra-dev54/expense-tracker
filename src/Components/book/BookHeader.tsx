"use client";

import { EntrybookType } from "@/Types/ExpenseType";

interface Props {
  book: EntrybookType;
  expenseCount: number;
  isClearingBook: boolean;
  onCreateExpense: () => void;
  onClearBook: () => void;
}

export default function BookHeader({
  book,
  expenseCount,
  isClearingBook,
  onCreateExpense,
  onClearBook,
}: Props) {
  return (
    <div className="mb-4 self-center text-center font-bold mt-4">
      <h1 className="text-3xl">{book.name}</h1>

      <h1 className="text-slate-400">
        bal:
        <span
          className={
            book.balance < 0 ? "text-red-400" : "text-green-400"
          }
        >
          {" " + book.balance}
        </span>
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <button
          className="p-2 rounded-full cursor-pointer bg-green-500 text-black px-4"
          onClick={onCreateExpense}
        >
          Create New
        </button>

        <button
          className="p-2 rounded-full cursor-pointer bg-red-500 text-white px-4 disabled:opacity-50"
          onClick={onClearBook}
          disabled={expenseCount === 0 || isClearingBook}
        >
          {isClearingBook ? "Clearing..." : "Clear Book"}
        </button>
      </div>
    </div>
  );
}