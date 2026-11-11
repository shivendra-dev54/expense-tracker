"use client";

import { CreateExpenseModal } from "@/Components/CreateExpenseModal";
import { ViewExpenseModal } from "@/Components/ViewExpenseModal";
import { useAuthStore } from "@/Store/AuthStore";
import { EntrybookType, ExpenseType } from "@/Types/ExpenseType";
import { axiosRequestHandler } from "@/util/axiosRequestHandler";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TransactionType = "all" | "deposit" | "withdrawal";
type DateFilter = "all" | "today" | "7days" | "30days" | "custom";

type BulkDeleteResponse = {
  deleted_count: number;
  deleted_ids: string[];
  balance: number;
};

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateKey = (date: Date | string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
};

const subtractDays = (date: string, days: number) => {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() - days);

  return result.toISOString().slice(0, 10);
};

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuthStore();

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [book, setBook] = useState<EntrybookType | null>(null);

  const [isExpenseViewOpen, setIsExpenseViewOpen] = useState(false);
  const [visibleExpense, setVisibleExpense] = useState<ExpenseType | null>(null);

  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false);

  // Filter states
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState<TransactionType>("all");
  const [sortBy, setSortBy] = useState("newest");

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Bulk selection states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<Set<string>>(
    new Set()
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState("");


  // Book clear states
  const [isClearingBook, setIsClearingBook] = useState(false);
  const [clearBookError, setClearBookError] = useState("");

  const inputClass =
    "w-full bg-slate-950 text-white p-3 rounded-xl outline-none border border-slate-700 focus:border-green-400";

  useEffect(() => {
    setIsFiltersOpen(false);
    setIsSelectionMode(false);
    setSelectedExpenseIds(new Set());
    setBulkDeleteError("");
  }, [id]);

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
        [...(expensesData ?? [])].sort(
          (a, b) =>
            new Date(b.expense_date).getTime() -
            new Date(a.expense_date).getTime()
        )
      );
    };

    getExpensesData();
  }, [id, logout]);

  // Search, filter and sort transactions
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search by description
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter((expense) =>
        (expense.message ?? "").toLowerCase().includes(searchTerm)
      );
    }

    // Transaction type
    if (transactionType === "deposit") {
      result = result.filter((expense) => expense.amount > 0);
    } else if (transactionType === "withdrawal") {
      result = result.filter((expense) => expense.amount < 0);
    }

    // Date filter
    const today = getToday();

    if (dateFilter === "today") {
      result = result.filter(
        (expense) => getDateKey(expense.expense_date) === today
      );
    } else if (dateFilter === "7days") {
      const startDate = subtractDays(today, 6);

      result = result.filter((expense) => {
        const date = getDateKey(expense.expense_date);
        return date >= startDate && date <= today;
      });
    } else if (dateFilter === "30days") {
      const startDate = subtractDays(today, 29);

      result = result.filter((expense) => {
        const date = getDateKey(expense.expense_date);
        return date >= startDate && date <= today;
      });
    } else if (dateFilter === "custom") {
      result = result.filter((expense) => {
        const date = getDateKey(expense.expense_date);

        if (customStartDate && date < customStartDate) return false;
        if (customEndDate && date > customEndDate) return false;

        return true;
      });
    }

    // Amount filter (absolute amount)
    const min = minAmount === "" ? null : Number(minAmount);
    const max = maxAmount === "" ? null : Number(maxAmount);

    result = result.filter((expense) => {
      const amount = Math.abs(expense.amount);

      if (min !== null && amount < min) return false;
      if (max !== null && amount > max) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.expense_date).getTime() -
            new Date(b.expense_date).getTime()
          );

        case "highest":
          return Math.abs(b.amount) - Math.abs(a.amount);

        case "lowest":
          return Math.abs(a.amount) - Math.abs(b.amount);

        case "newest":
        default:
          return (
            new Date(b.expense_date).getTime() -
            new Date(a.expense_date).getTime()
          );
      }
    });

    return result;
  }, [
    expenses,
    search,
    transactionType,
    sortBy,
    dateFilter,
    customStartDate,
    customEndDate,
    minAmount,
    maxAmount
  ]);

  const clearFilters = () => {
    setSearch("");
    setTransactionType("all");
    setSortBy("newest");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  const hasActiveFilters =
    search !== "" ||
    transactionType !== "all" ||
    sortBy !== "newest" ||
    dateFilter !== "all" ||
    minAmount !== "" ||
    maxAmount !== "";

  // Bulk selection handlers
  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedExpenseIds(new Set());
      setBulkDeleteError("");
    }

    setIsSelectionMode((prev) => !prev);
  };

  const toggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenseIds((prev) => {
      const updated = new Set(prev);

      if (updated.has(expenseId)) {
        updated.delete(expenseId);
      } else {
        updated.add(expenseId);
      }

      return updated;
    });

    setBulkDeleteError("");
  };

  const visibleExpenseIds = filteredExpenses.map((expense) => expense._id);

  const allVisibleSelected =
    visibleExpenseIds.length > 0 &&
    visibleExpenseIds.every((expenseId) =>
      selectedExpenseIds.has(expenseId)
    );

  const toggleSelectAllVisible = () => {
    setSelectedExpenseIds((prev) => {
      const updated = new Set(prev);

      if (allVisibleSelected) {
        visibleExpenseIds.forEach((expenseId) => updated.delete(expenseId));
      } else {
        visibleExpenseIds.forEach((expenseId) => updated.add(expenseId));
      }

      return updated;
    });

    setBulkDeleteError("");
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedExpenseIds.size === 0 || isBulkDeleting) return;

    const count = selectedExpenseIds.size;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${count} selected transaction${count === 1 ? "" : "s"}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsBulkDeleting(true);
    setBulkDeleteError("");

    try {
      const resp = await axiosRequestHandler(
        "/api/expense/bulk",
        "DELETE",
        {
          book_id: id,
          expense_ids: Array.from(selectedExpenseIds)
        },
        logout
      );

      const result = resp?.data.data as BulkDeleteResponse | undefined;

      if (
        !result ||
        !Array.isArray(result.deleted_ids) ||
        typeof result.balance !== "number"
      ) {
        throw new Error("Invalid bulk delete response.");
      }

      const deletedIds = new Set(result.deleted_ids);

      setExpenses((prev) =>
        prev.filter((expense) => !deletedIds.has(expense._id))
      );

      // Use the balance calculated by the backend.
      setBook((prev) =>
        prev
          ? {
            ...prev,
            balance: result.balance
          }
          : prev
      );

      setSelectedExpenseIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      setBulkDeleteError(
        "Unable to delete selected transactions. Please try again."
      );
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // book clear handler
  const handleClearBook = async () => {
    if (expenses.length === 0 || isClearingBook) return;

    const count = expenses.length;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete all ${count} transactions from "${book?.name}"? The book itself will not be deleted. This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsClearingBook(true);
    setClearBookError("");

    try {
      const resp = await axiosRequestHandler(
        "/api/expense/bulk",
        "DELETE",
        {
          book_id: id,
          expense_ids: expenses.map((expense) => expense._id),
        },
        logout
      );

      const result = resp?.data.data as BulkDeleteResponse | undefined;

      if (
        !result ||
        !Array.isArray(result.deleted_ids) ||
        typeof result.balance !== "number"
      ) {
        throw new Error("Invalid clear book response.");
      }

      const deletedIds = new Set(result.deleted_ids);

      setExpenses((prev) =>
        prev.filter((expense) => !deletedIds.has(expense._id))
      );

      setBook((prev) =>
        prev
          ? {
            ...prev,
            balance: result.balance,
          }
          : prev
      );

      setSelectedExpenseIds(new Set());
      setIsSelectionMode(false);
      setBulkDeleteError("");
    } catch (error) {
      console.error("Clear book failed:", error);
      setClearBookError("Unable to clear this book. Please try again.");
    } finally {
      setIsClearingBook(false);
    }
  };

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

          <h1 className="text-slate-400">
            bal:
            <span className={book.balance < 0 ? "text-red-400" : "text-green-400"}>
              {" " + book.balance}
            </span>
          </h1>

          <div className="flex flex-col mt-4">
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                className="p-2 rounded-full cursor-pointer bg-green-500 text-black px-4 disabled:opacity-50"
                onClick={() => setIsCreateExpenseModalOpen(true)}
              >
                Create New
              </button>

              <button
                className="p-2 rounded-full cursor-pointer bg-red-500 text-white px-4 disabled:opacity-50"
                onClick={handleClearBook}
                disabled={expenses.length === 0 || isClearingBook || isBulkDeleting}
              >
                {isClearingBook ? "Clearing..." : "Clear Book"}
              </button>
            </div>

            {clearBookError && (
              <p className="text-red-400 text-sm mt-2">
                {clearBookError}
              </p>
            )}
          </div>

        </div>
      )}

      {/* Create Expense Modal */}
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

      {/* View Expense Modal */}
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

      {/* Search and Filters */}
      {book?.name && (
        <div className="w-[95%] md:w-1/2 self-center bg-slate-800 p-4 rounded-2xl mb-4">

          <div className="flex justify-between items-center gap-2">

            <div>
              <h2 className="text-xl font-bold">
                Transactions
              </h2>

              <p className="text-sm text-slate-400">
                Showing {filteredExpenses.length} of {expenses.length} transactions
              </p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                type="button"
                onClick={toggleSelectionMode}
                disabled={isBulkDeleting}
                className={`px-4 py-2 rounded-full cursor-pointer transition-colors whitespace-nowrap disabled:opacity-50 ${isSelectionMode
                  ? "bg-red-500 text-white"
                  : "bg-slate-950 text-green-400 hover:bg-slate-700"
                  }`}
              >
                {isSelectionMode ? "Cancel selection" : "Select"}
              </button>

              <button
                type="button"
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                className="bg-slate-950 text-green-400 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                {isFiltersOpen ? "Hide filters ▲" : "Show filters ▼"}
              </button>
            </div>

          </div>

          {/* Bulk Selection Controls */}
          {isSelectionMode && (
            <div className="mt-4 p-3 bg-slate-900 rounded-xl">

              <div className="flex justify-between items-center gap-2 flex-wrap">

                <div>
                  <p className="font-semibold">
                    {selectedExpenseIds.size} selected
                  </p>

                  <p className="text-xs text-slate-400">
                    Select transactions from the currently displayed results.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleSelectAllVisible}
                  disabled={filteredExpenses.length === 0 || isBulkDeleting}
                  className="text-sm text-green-400 hover:text-green-300 cursor-pointer disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  {allVisibleSelected ? "Deselect visible" : "Select all visible"}
                </button>

              </div>

              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={selectedExpenseIds.size === 0 || isBulkDeleting}
                className="w-full mt-3 p-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {isBulkDeleting
                  ? "Deleting..."
                  : `Delete Selected (${selectedExpenseIds.size})`}
              </button>

              {bulkDeleteError && (
                <p className="text-red-400 text-sm mt-2 text-center">
                  {bulkDeleteError}
                </p>
              )}

            </div>
          )}

          {isFiltersOpen && (
            <div className="mt-4">

              {/* Search */}
              <input
                type="text"
                placeholder="Search by description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={inputClass}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Transaction type
                  </label>

                  <select
                    value={transactionType}
                    onChange={(e) =>
                      setTransactionType(e.target.value as TransactionType)
                    }
                    className={inputClass}
                  >
                    <option value="all">All transactions</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Sort by
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={inputClass}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest amount</option>
                    <option value="lowest">Lowest amount</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Date range
                  </label>

                  <select
                    value={dateFilter}
                    onChange={(e) =>
                      setDateFilter(e.target.value as DateFilter)
                    }
                    className={inputClass}
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>

                {/* Minimum Amount */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Minimum amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Min amount"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Maximum Amount */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Maximum amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Max amount"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className={inputClass}
                  />
                </div>

              </div>

              {/* Custom Date Range */}
              {dateFilter === "custom" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      From
                    </label>

                    <input
                      type="date"
                      value={customStartDate}
                      max={customEndDate || getToday()}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      To
                    </label>

                    <input
                      type="date"
                      value={customEndDate}
                      min={customStartDate || undefined}
                      max={getToday()}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                </div>
              )}

              {/* Clear Filters */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="text-sm text-green-400 hover:text-green-300 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer"
                >
                  Clear filters
                </button>
              </div>

              {minAmount !== "" &&
                maxAmount !== "" &&
                Number(minAmount) > Number(maxAmount) && (
                  <p className="text-red-400 text-sm mt-2">
                    Minimum amount cannot exceed maximum amount.
                  </p>
                )}

            </div>
          )}

        </div>
      )}

      {/* Transaction List */}
      <div className="flex flex-col">

        {filteredExpenses.length === 0 && book?.name && (
          <div className="text-center text-slate-400 p-8">
            {expenses.length === 0
              ? "No transactions yet. Create your first transaction."
              : "No transactions match your search or filters."}
          </div>
        )}

        {filteredExpenses.map((e) => {
          const isSelected = selectedExpenseIds.has(e._id);

          return (
            <div
              key={e._id}
              id={e._id}
              className={`ml-2 mb-2 mr-2 bg-slate-800 p-3 rounded-2xl md:self-center md:w-1/2 md:text-lg overflow-hidden transition-colors ${isSelectionMode
                ? "cursor-pointer hover:bg-slate-700"
                : "cursor-pointer hover:bg-slate-700"
                } ${isSelected ? "border-2 border-green-400" : "border-2 border-transparent"
                }`}
              onClick={() => {
                if (isSelectionMode) {
                  toggleExpenseSelection(e._id);
                  return;
                }

                setVisibleExpense(e);
                setIsExpenseViewOpen(true);
              }}
            >

              <div className="flex items-start gap-3">

                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleExpenseSelection(e._id)}
                    onClick={(event) => event.stopPropagation()}
                    className="mt-1 w-5 h-5 accent-green-400 cursor-pointer shrink-0"
                    aria-label={`Select transaction ${e.message || e._id}`}
                  />
                )}

                <div className="flex-1 min-w-0">

                  <p>
                    msg:
                    <span className="text-slate-300">
                      {" " + (e.message || "No description")}
                    </span>
                  </p>

                  <p>
                    amt:
                    <span className={e.amount < 0 ? "text-red-400" : "text-green-400"}>
                      {" " + e.amount}
                    </span>
                  </p>

                  <p>
                    date:
                    {" " + (
                      e.expense_date
                        ? getDateKey(e.expense_date)
                        : "N/A"
                    )}
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

    </div>
  );
}
