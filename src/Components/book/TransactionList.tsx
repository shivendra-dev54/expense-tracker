"use client";

import { ExpenseType } from "@/Types/ExpenseType";

interface Props {
  expenses: ExpenseType[];
  isSelectionMode: boolean;
  selectedExpenseIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onViewExpense: (expense: ExpenseType) => void;
  getDateKey: (date: Date | string) => string;
  hasTransactions: boolean;
}

export default function TransactionList({
  expenses,
  isSelectionMode,
  selectedExpenseIds,
  onToggleSelection,
  onViewExpense,
  getDateKey,
  hasTransactions,
}: Props) {
  if (expenses.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8">
        {hasTransactions
          ? "No transactions match your search or filters."
          : "No transactions yet. Create your first transaction."}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {expenses.map((expense) => {
        const isSelected = selectedExpenseIds.has(expense._id);

        return (
          <div
            key={expense._id}
            id={expense._id}
            className={`ml-2 mb-2 mr-2 bg-slate-800 p-3 rounded-2xl md:self-center md:w-1/2 md:text-lg overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors ${
              isSelected
                ? "border-2 border-green-400"
                : "border-2 border-transparent"
            }`}
            onClick={() => {
              if (isSelectionMode) {
                onToggleSelection(expense._id);
                return;
              }

              onViewExpense(expense);
            }}
          >
            <div className="flex items-start gap-3">
              {isSelectionMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(expense._id)}
                  onClick={(event) => event.stopPropagation()}
                  className="mt-1 w-5 h-5 accent-green-400 cursor-pointer shrink-0"
                  aria-label={`Select transaction ${
                    expense.message || expense._id
                  }`}
                />
              )}

              <div className="flex-1 min-w-0">
                <p>
                  msg:
                  <span className="text-slate-300">
                    {" " + (expense.message || "No description")}
                  </span>
                </p>

                <p>
                  amt:
                  <span
                    className={
                      expense.amount < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {" " + expense.amount}
                  </span>
                </p>

                <p>
                  date:
                  {" " +
                    (expense.expense_date
                      ? getDateKey(expense.expense_date)
                      : "N/A")}
                </p>
              </div>

              {isSelected && isSelectionMode && (
                <span className="text-green-400 text-sm font-semibold shrink-0">
                  Selected
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}