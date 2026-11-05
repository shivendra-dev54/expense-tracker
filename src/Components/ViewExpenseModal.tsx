"use client";

import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useAuthStore } from "@/Store/AuthStore";
import { Dispatch, SetStateAction, useState } from "react";
import { UpdateExpenseModal } from "./UpdateExpenseModal";

export const ViewExpenseModal = (
  {
    visibleExpense,
    setVisibleExpense,
    setIsExpenseViewOpen,
    setExpenses,
    setBook
  }: {
    visibleExpense: ExpenseType | null,
    setVisibleExpense: Dispatch<SetStateAction<ExpenseType | null>>,
    setIsExpenseViewOpen: Dispatch<SetStateAction<boolean>>,
    setExpenses: Dispatch<SetStateAction<any[]>>,
    setBook: Dispatch<SetStateAction<EntrybookType | null>>
  }
) => {
  const { logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDelete = async () => {
    const id = visibleExpense?._id;

    if (!id || !visibleExpense || isLoading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError("");

    try {
      await axiosRequestHandler(
        `/api/expense/${id}`,
        "DELETE",
        null,
        logout
      );

      setExpenses((expenses) => {
        return expenses.filter((exp) => exp._id !== id);
      });

      setBook((book) => {
        if (!book) return book;

        return {
          ...book,
          balance: book.balance - visibleExpense.amount
        };
      });

      setVisibleExpense(null);
      setIsExpenseViewOpen(false);

    } catch (err) {
      console.error(err);
      setError("Unable to delete expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const transactionDate = visibleExpense?.expense_date ?? visibleExpense?.createdAt;


  return (
    <div className="flex flex-col p-8 bg-slate-800 rounded-2xl gap-1 min-w-84 text-slate-400">

      {isUpdating && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          <UpdateExpenseModal
            setIsUpdating={setIsUpdating}
            visibleExpense={visibleExpense}
            setExpenses={setExpenses}
            setVisibleExpense={setVisibleExpense}
            setBook={setBook}
          />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      <h1 className="text-center text-3xl font-bold mb-4 text-slate-100">
        Expense
      </h1>

      <div className="flex justify-between">
        <span>amount:</span>

        <span
          className={`text-end ${
            (visibleExpense?.amount ?? 0) < 0
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {visibleExpense?.amount}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>msg:</span>

        <span className="text-slate-300 text-lg text-end">
          {visibleExpense?.message || "No description"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>date:</span>

        <span className="text-cyan-300 text-lg">
          {transactionDate
            ? new Date(transactionDate).toISOString().slice(0, 10)
            : "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span>type:</span>

        <span className="text-blue-300">
          {(visibleExpense?.amount ?? 0) < 0
            ? "withdrawn"
            : "credited"}
        </span>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center mt-2">
          {error}
        </p>
      )}

      <div className="flex justify-between my-4 gap-4">

        {/* Update button */}
        <button
          type="button"
          disabled={isLoading}
          className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 rounded-full disabled:opacity-50"
          onClick={() => setIsUpdating(true)}
        >
          <svg
            fill="#aaffaa"
            width="32px"
            height="32px"
            viewBox="0 0 420.827 420.827"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M210.29,0C156,0,104.43,20.693,65.077,58.269C25.859,95.715,2.794,146.022,0.134,199.921c-0.135,2.734,0.857,5.404,2.744,7.388c1.889,1.983,4.507,3.105,7.244,3.105h45.211c5.275,0,9.644-4.098,9.979-9.362c4.871-76.214,68.553-135.914,144.979-135.914c80.105,0,145.275,65.171,145.275,145.276c0,80.105-65.17,145.276-145.275,145.276c-18.109,0-35.772-3.287-52.501-9.771l17.366-15.425c2.686-2.354,3.912-5.964,3.217-9.468c-0.696-3.506-3.209-6.371-6.592-7.521l-113-32.552c-3.387-1.149-7.122-0.407-9.81,1.948c-2.686,2.354-3.913,5.963-3.218,9.467L69.71,403.157c0.696,3.505,3.209,6.372,6.591,7.521c3.383,1.147,7.122,0.408,9.81-1.946l18.599-16.298c31.946,18.574,68.456,28.394,105.581,28.394c116.021,0,210.414-94.392,210.414-210.414C420.705,94.391,326.312,0,210.29,0z" />
            <path d="M195.112,237.9h118.5c2.757,0,5-2.242,5-5v-30c0-2.757-2.243-5-5-5h-83.5v-91c0-2.757-2.243-5-5-5h-30c-2.757,0-5,2.243-5,5v126C190.112,235.658,192.355,237.9,195.112,237.9z" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          type="button"
          disabled={isLoading}
          className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 rounded-full disabled:opacity-50"
          onClick={handleDelete}
        >
          <svg
            fill="#ff8888"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />
          </svg>
        </button>

      </div>

      <button
        type="button"
        className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
        onClick={() => setIsExpenseViewOpen(false)}
      >
        close
      </button>

    </div>
  );
};