export default function Pagination({ page = 1, totalPages = 1, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(prev)}
        disabled={page <= 1}
        className="rounded-lg border border-border px-3 py-2 text-sm text-textSecondary transition hover:border-primary/40 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="px-3 text-sm text-textMuted">
        Page {page} of {totalPages}
        {typeof total === "number" ? ` · ${total} total` : ""}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(next)}
        disabled={page >= totalPages}
        className="rounded-lg border border-border px-3 py-2 text-sm text-textSecondary transition hover:border-primary/40 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
