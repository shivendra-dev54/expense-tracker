"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

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

  const [amount, setAmount] = useState<number | null>(visibleExpense?.amount! < 0 ? (0 - visibleExpense?.amount!) : (visibleExpense?.amount!));
  const [message, setMessage] = useState<string | null>(visibleExpense?.message!);
  const [isCredited, setIsCredited] = useState<boolean>((visibleExpense?.amount! > 0) || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!amount || amount === 0) {
      return;
    }
    setIsLoading(true);

    const payload = {
      amount: (isCredited ? (amount) : (0 - amount)),
      message
    };

    const resp = await axiosRequestHandler(
      `/api/expense/${visibleExpense?._id}`,
      "post",
      payload,
      logout
    );

    const updated_exp = resp?.data.data;

    setExpenses((expenses) => {
      const expenses_without_updated = expenses.filter((exp) => {
        return exp._id !== visibleExpense?._id;
      });
      return [...expenses_without_updated, updated_exp];
    });

    setBook((book) => {
      return {
        ...book,
        balance: book?.balance + updated_exp.amount - visibleExpense?.amount!
      } as EntrybookType;
    });
    setVisibleExpense(updated_exp);

    setIsLoading(false);
    setIsUpdating(false);
  }

  return (
    <div
      className="bg-black/25"
    >

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      <h1
        className="text-4xl font-extrabold text-center"
      >Update Expense!</h1>

      <form
        className="flex flex-col mt-4 bg-slate-800 p-6 rounded-2xl gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
      >
        <label htmlFor="amount_input">amount:</label>
        <input
          type="text"
          id="amount_input"
          className="bg-slate-950 rounded-3xl p-2 pl-4 pr-4 outline-none w-full select-text"
          required
          min={0}
          value={amount || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setAmount(val);
          }}
          inputMode="numeric"
          pattern="[0-9]*"
        />

        <label htmlFor="message_input" >message:</label>
        <input
          type="text"
          id="amount_input"
          className="bg-slate-950 rounded-3xl p-2 pl-4 pr-4 outline-none w-full select-text"
          value={message || ""}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div
          className="flex justify-between gap-1 bg-slate-900 rounded-full scale-75 w-72 self-center"
        >
          <button
            className={`self-center cursor-pointer p-2 pl-6 pr-6 rounded-full ${!isCredited ? ("bg-green-400 text-black font-bold") : ("bg-slate-900 text-white")}`}
            onClick={(e) => {
              e.preventDefault();
              setIsCredited(false);
            }}
          >
            withdraw
          </button>

          <button
            className={`self-center cursor-pointer p-2 pl-6 pr-6 rounded-full ${isCredited ? ("bg-green-400 text-black font-bold") : ("bg-slate-900 text-white")}`}
            onClick={(e) => {
              e.preventDefault();
              setIsCredited(true);
            }}
          >
            deposit
          </button>
        </div>

        <div
          className="flex justify-between mt-6"
        >
          <button
            className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
            type="submit"
          >
            update
          </button>

          <button
            className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setIsUpdating(false);
            }}
          >
            close
          </button>
        </div>

      </form>
    </div>
  );
}