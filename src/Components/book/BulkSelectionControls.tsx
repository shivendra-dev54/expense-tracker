"use client";

interface Props {
  selectedCount: number;
  visibleCount: number;
  allVisibleSelected: boolean;
  isBulkDeleting: boolean;
  error: string;
  onSelectAll: () => void;
  onDelete: () => void;
}

export default function BulkSelectionControls({
  selectedCount,
  visibleCount,
  allVisibleSelected,
  isBulkDeleting,
  error,
  onSelectAll,
  onDelete,
}: Props) {
  return (
    <div className="mt-4 p-3 bg-slate-900 rounded-xl">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div>
          <p className="font-semibold">{selectedCount} selected</p>

          <p className="text-xs text-slate-400">
            Select transactions from the currently displayed results.
          </p>
        </div>

        <button
          type="button"
          onClick={onSelectAll}
          disabled={visibleCount === 0 || isBulkDeleting}
          className="text-sm text-green-400 hover:text-green-300 cursor-pointer disabled:text-slate-600 disabled:cursor-not-allowed"
        >
          {allVisibleSelected ? "Deselect visible" : "Select all visible"}
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={selectedCount === 0 || isBulkDeleting}
        className="w-full mt-3 p-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {isBulkDeleting
          ? "Deleting..."
          : `Delete Selected (${selectedCount})`}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}