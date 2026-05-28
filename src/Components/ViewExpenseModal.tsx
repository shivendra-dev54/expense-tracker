"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { Dispatch, SetStateAction, useState } from "react";

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

  const handleDelete = async () => {

    const id = visibleExpense?._id;

    if (!id) {
      return;
    }

    setIsLoading(true);
    await axiosRequestHandler(
      `/api/expense/${id}`,
      "DELETE",
      null,
      logout
    );

    setExpenses((e) => {
      return e.filter((exp) => {
        return exp._id !== id;
      });
    });

    setBook((book) => {
      return {
        ...book,
        balance: (book?.balance! - visibleExpense.amount)
      } as EntrybookType;
    });

    setIsLoading(false);
    setIsExpenseViewOpen(false);
  }


  return (
    <div
      className="flex flex-col p-8 bg-slate-800 rounded-2xl gap-1 min-w-84 text-slate-400"
    >
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}
      <h1
        className="text-center text-3xl font-bold mb-4 text-slate-100"
      >
        Expense
      </h1>

      <div
        className="flex justify-between"
      >
        <span>
          amount:
        </span>
        <span
          className={`text-end" + ${(visibleExpense?.amount! < 0) ? ("text-red-400") : ("text-green-400")}`}
        >
          {" " + visibleExpense?.amount}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>
          msg:
        </span>
        <span className="text-slate-300 text-lg text-end">
          {visibleExpense?.message}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>
          date:
        </span>
        <span className="text-cyan-300 text-lg">
          {new Date(visibleExpense?.createdAt!).toLocaleDateString()}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          time
        </span>
        <span className="text-cyan-300 text-lg">
          {new Date(visibleExpense?.createdAt!).toLocaleTimeString()}
        </span>
      </div>

      <div
        className="flex justify-between"
      >
        <span>
          type:
        </span>
        <span className="text-blue-300">
          {visibleExpense?.amount! < 0 ? ("withdrawn") : ("credited")}
        </span>
      </div>

      <div
        className="flex justify-between my-4 gap-4"
      >
        <button
          className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 rounded-full"
        >
          <svg fill="#aaffaa" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 420.827 420.827" xmlSpace="preserve" stroke="#aaffaa">
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
            </g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <path d="M210.29,0C156,0,104.43,20.693,65.077,58.269C25.859,95.715,2.794,146.022,0.134,199.921 c-0.135,2.734,0.857,5.404,2.744,7.388c1.889,1.983,4.507,3.105,7.244,3.105h45.211c5.275,0,9.644-4.098,9.979-9.362 c4.871-76.214,68.553-135.914,144.979-135.914c80.105,0,145.275,65.171,145.275,145.276c0,80.105-65.17,145.276-145.275,145.276 c-18.109,0-35.772-3.287-52.501-9.771l17.366-15.425c2.686-2.354,3.912-5.964,3.217-9.468c-0.696-3.506-3.209-6.371-6.592-7.521 l-113-32.552c-3.387-1.149-7.122-0.407-9.81,1.948c-2.686,2.354-3.913,5.963-3.218,9.467L69.71,403.157 c0.696,3.505,3.209,6.372,6.591,7.521c3.383,1.147,7.122,0.408,9.81-1.946l18.599-16.298 c31.946,18.574,68.456,28.394,105.581,28.394c116.021,0,210.414-94.392,210.414-210.414C420.705,94.391,326.312,0,210.29,0z">
                  </path>
                  <path d="M195.112,237.9h118.5c2.757,0,5-2.242,5-5v-30c0-2.757-2.243-5-5-5h-83.5v-91c0-2.757-2.243-5-5-5h-30 c-2.757,0-5,2.243-5,5v126C190.112,235.658,192.355,237.9,195.112,237.9z">
                  </path>
                </g>
              </g>
            </g>
          </svg>
        </button>

        <button
          className="self-center cursor-pointer text-green-300 bg-slate-950 p-2 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          <svg fill="#ff8888" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ff8888">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path>
            </g>
          </svg>
        </button>
      </div>

      <button
        className="self-center cursor-pointer text-red-300 bg-slate-950 p-2 pl-8 pr-8 rounded-full"
        onClick={(e) => {
          e.preventDefault();
          setIsExpenseViewOpen(false);
        }}
      >close</button>
    </div>
  );
}