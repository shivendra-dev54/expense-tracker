"use client";

import { useAuthStore } from "@/Store/AuthStore";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookPage() {

  const { id } = useParams<{ id: string }>();
  const { logout } = useAuthStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [book, setBook] = useState<ExpenseType | null>(null);

  useEffect(() => {
    const getExpensesData = async () => {
      const resp = await axiosRequestHandler(
        `/api/expense?book_id=${id}`,
        "GET",
        null,
        logout
      );
      const bookData = resp.data.data.book;
      const expensesData = resp.data.data.expenses;

      setBook(bookData);
      setExpenses(expensesData);
    }
    getExpensesData();
  }, []);

  return (
    <div className="w-full flex flex-col flex-1 bg-slate-900 text-white">
      <div className="mb-4 self-center text-center font-bold mt-4">
        <h1 className="text-3xl">
          {book?.name}
        </h1>
        <h1 className="text-slate-600">
          bal:
          <span className={`${(book?.balance! < 0) ? ("text-red-400") : ("text-green-400")}`}>
            {" " + book?.balance}
          </span>
        </h1>
      </div>

      {
        expenses?.map(
          (e) => {
            return (
              <div
                key={e._id}
                id={e._id}
                className="ml-2 mb-2 mr-2 bg-slate-800 p-3 rounded-2xl md:self-center md:w-1/2 md:text-lg"
              >
                <p>
                  msg: {e.message}
                </p>
                <p className={`  ${(e.amount < 0) ? ("text-red-400") : ("text-green-400")}`}>
                  amt: {e.amount}
                </p>
                <p>
                  date: {new Date(e.createdAt).toLocaleDateString() + " || " + new Date(e.createdAt).toLocaleTimeString()}
                </p>
              </div>
            );
          }
        )
      }

    </div>
  );
}