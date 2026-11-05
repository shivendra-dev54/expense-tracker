"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const UpdateExpenseModal = (
  {
    setIsUpdating,
    visibleExpense,
    setVisibleExpense,
    setExpenses,
    setBook
  }: {
    visibleExpense: ExpenseType | null,
    setIsUpdating: Dispatch<SetStateAction<boolean>>,
    setVisibleExpense: Dispatch<SetStateAction<ExpenseType | null>>,
    setExpenses: Dispatch<SetStateAction<any[]>>,
    setBook: Dispatch<SetStateAction<EntrybookType | null>>
  }
) => {
  const { logout } = useAuthStore();

  const [amount, setAmount] = useState<string>(
    String(Math.abs(visibleExpense?.amount ?? 0))
  );

  const [message, setMessage] = useState<string>(
    visibleExpense?.message ?? ""
  );

  const initialDate =
    visibleExpense?.expense_date ?? visibleExpense?.createdAt;

  const [expenseDate, setExpenseDate] = useState<string>(
    initialDate
      ? new Date(initialDate).toISOString().slice(0, 10)
      : getToday()
  );

  const [isCredited, setIsCredited] = useState<boolean>(
    (visibleExpense?.amount ?? 0) > 0
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);

    if (!visibleExpense || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !expenseDate) {
      setError("Please enter a valid amount and date.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        amount: isCredited ? parsedAmount : -parsedAmount,
        message,
        expense_date: new Date(`${expenseDate}T00:00:00.000Z`)
      };

      const resp = await axiosRequestHandler(
        `/api/expense/${visibleExpense._id}`,
        "post",
        payload,
        logout
      );

      const updated_exp = resp?.data.data;

      if (!updated_exp) {
        throw new Error("Failed to update expense.");
      }

      setExpenses((expenses) => {
        return expenses.map((exp) =>
          exp._id === visibleExpense._id
            ? updated_exp
            : exp
        );
      });

      setBook((book) => {
        if (!book) return book;

        return {
          ...book,
          balance: book.balance + updated_exp.amount - visibleExpense.amount
        };
      });

      setVisibleExpense(updated_exp);
      setIsUpdating(false);

    } catch (err) {
      console.error(err);
      setError("Unable to update expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/25">

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-center">
        Update Expense!
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
            update
          </button>

          <button
            type="button"
            className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
            onClick={() => setIsUpdating(false)}
            disabled={isLoading}
          >
            close
          </button>

        </div>

      </form>
    </div>
  );
};