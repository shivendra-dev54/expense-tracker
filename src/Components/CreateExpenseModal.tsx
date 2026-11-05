"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const CreateExpenseModal = (
  {
    setIsCreateExpenseModalOpen,
    book_id,
    setExpenses,
    setBook
  }: {
    setIsCreateExpenseModalOpen: Dispatch<SetStateAction<boolean>>,
    book_id: string,
    setExpenses: Dispatch<SetStateAction<any[]>>,
    setBook: Dispatch<SetStateAction<EntrybookType | null>>
  }
) => {
  const { logout } = useAuthStore();

  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<string>(getToday());
  const [isCredited, setIsCredited] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !book_id || !expenseDate) {
      setError("Please enter a valid amount and date.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        book_id,
        amount: isCredited ? parsedAmount : -parsedAmount,
        message,
        expense_date: new Date(`${expenseDate}T00:00:00.000Z`)
      };

      console.log("payload: ", payload);

      const resp = await axiosRequestHandler(
        "/api/expense",
        "POST",
        payload,
        logout
      );

      const new_exp = resp?.data.data;

      console.log(new_exp);

      if (!new_exp) {
        throw new Error("Failed to create expense.");
      }

      setExpenses((expenses) => [new_exp, ...expenses]);

      setBook((book) => {
        if (!book) return book;

        return {
          ...book,
          balance: book.balance + payload.amount
        };
      });

      setIsCreateExpenseModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Unable to create expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black/25 select-none">

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      <h1 className="text-center text-2xl font-extrabold">
        Add new Expense!
      </h1>

      <form
        className="flex flex-col mt-4 bg-slate-800 p-6 rounded-2xl gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
      >
        <label htmlFor="amount_input">Amount:</label>

        <input
          type="number"
          id="amount_input"
          className="bg-slate-950 rounded-3xl p-2 pl-4 pr-4 outline-none w-full select-text"
          required
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <label htmlFor="expense_date">Transaction date:</label>

        <input
          type="date"
          id="expense_date"
          className="bg-slate-950 rounded-3xl p-2 pl-4 pr-4 outline-none w-full select-text"
          required
          max={getToday()}
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />

        <label htmlFor="message_input">Message:</label>

        <input
          type="text"
          id="message_input"
          className="bg-slate-950 rounded-3xl p-2 pl-4 pr-4 outline-none w-full select-text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter description"
        />

        <div className="flex justify-between gap-1 bg-slate-900 rounded-full scale-75 w-72 self-center">

          <button
            type="button"
            className={`self-center cursor-pointer p-2 pl-6 pr-6 rounded-full ${
              !isCredited
                ? "bg-green-400 text-black font-bold"
                : "bg-slate-900 text-white"
            }`}
            onClick={() => setIsCredited(false)}
          >
            withdraw
          </button>

          <button
            type="button"
            className={`self-center cursor-pointer p-2 pl-6 pr-6 rounded-full ${
              isCredited
                ? "bg-green-400 text-black font-bold"
                : "bg-slate-900 text-white"
            }`}
            onClick={() => setIsCredited(true)}
          >
            deposit
          </button>

        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <div className="flex justify-between mt-6">

          <button
            className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            create
          </button>

          <button
            type="button"
            className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
            onClick={() => setIsCreateExpenseModalOpen(false)}
            disabled={isLoading}
          >
            close
          </button>

        </div>

      </form>
    </div>
  );
};