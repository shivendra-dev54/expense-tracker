"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

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

  const [amount, setAmount] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isCredited, setIsCredited] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!amount || amount === 0 || !book_id) {
      setIsLoading(false);
      return;
    }
    const payload = {
      book_id,
      amount: (isCredited ? (amount) : (0 - amount)),
      message
    };

    const resp = await axiosRequestHandler(
      "/api/expense",
      "POST",
      payload,
      logout
    );

    const new_exp = resp?.data.data;
    setExpenses((e) => [new_exp, ...e]);
    setIsLoading(false);
    setBook((b) => {
      return {
        ...b,
        balance: b?.balance! + payload.amount
      } as unknown as EntrybookType
    });
    setIsCreateExpenseModalOpen(false);
  }


  return (
    <div
      className="p-6 bg-black/25 select-none"
    >

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
          value={message}
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
            create
          </button>

          <button
            className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              setIsCreateExpenseModalOpen(false);
            }}
          >
            close
          </button>
        </div>

      </form>
    </div>
  );
}