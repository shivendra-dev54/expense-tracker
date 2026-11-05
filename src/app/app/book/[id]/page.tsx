"use client";

import { CreateExpenseModal } from "@/Components/CreateExpenseModal";
import { ViewExpenseModal } from "@/Components/ViewExpenseModal";
import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookPage() {

  const { id } = useParams<{ id: string }>();
  const { logout } = useAuthStore();

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [book, setBook] = useState<EntrybookType | null>(null);

  const [isExpenseViewOpen, setIsExpenseViewOpen] = useState<boolean>(false);
  const [visibleExpense, setVisibleExpense] = useState<ExpenseType | null>(null);

  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getExpensesData = async () => {
      const resp = await axiosRequestHandler(
        `/api/expense?book_id=${id}`,
        "GET",
        null,
        logout
      );

      const bookData = resp?.data.data.book;
      const expensesData = resp?.data.data.expenses as ExpenseType[];

      setBook(bookData);

      setExpenses(
        expensesData.sort(
          (a, b) =>
            new Date(b.expense_date).getTime() -
            new Date(a.expense_date).getTime()
        )
      );
    };

    getExpensesData();
  }, [id]);

  return (
    <div className="w-full flex flex-col flex-1 bg-slate-900 text-white">

      {!book?.name && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )}

      {book?.name && (
        <div className="mb-4 self-center text-center font-bold mt-4">

          <h1 className="text-3xl">
            {book.name}
          </h1>

          <h1 className="text-slate-600">
            bal:
            <span className={`${book.balance < 0 ? "text-red-400" : "text-green-400"}`}>
              {" " + book.balance}
            </span>
          </h1>

          <div className="flex flex-col mt-4">
            <button
              className="p-2 rounded-full self-center cursor-pointer bg-green-500 text-black pl-4 pr-4"
              onClick={() => setIsCreateExpenseModalOpen(true)}
            >
              create new
            </button>
          </div>

        </div>
      )}

      {isCreateExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          <CreateExpenseModal
            setIsCreateExpenseModalOpen={setIsCreateExpenseModalOpen}
            book_id={id}
            setExpenses={setExpenses}
            setBook={setBook}
          />
        </div>
      )}

      {isExpenseViewOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          <ViewExpenseModal
            visibleExpense={visibleExpense}
            setVisibleExpense={setVisibleExpense}
            setIsExpenseViewOpen={setIsExpenseViewOpen}
            setExpenses={setExpenses}
            setBook={setBook}
          />
        </div>
      )}

      {expenses.map((e) => (
        <div
          key={e._id}
          id={e._id}
          className="ml-2 mb-2 mr-2 bg-slate-800 p-3 rounded-2xl md:self-center md:w-1/2 md:text-lg overflow-hidden cursor-pointer"
          onClick={() => {
            setVisibleExpense(e);
            setIsExpenseViewOpen(true);
          }}
        >

          <p>
            msg:
            <span className="text-slate-300">
              {e.message}
            </span>
          </p>

          <p>
            amt:
            <span className={e.amount < 0 ? "text-red-400" : "text-green-400"}>
              {e.amount}
            </span>
          </p>

          <p>
            date:
            {" " + (
              e.expense_date
                ? new Date(e.expense_date).toISOString().slice(0, 10)
                : "N/A"
            )}
          </p>

        </div>
      ))}

    </div>
  );
}