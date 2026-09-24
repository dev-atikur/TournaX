import { clsx } from "clsx";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

export default function Table({
  columns = [],
  rows = [],
  rowKey,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription,
  emptyIcon,
}) {
  if (loading) return <LoadingState variant="table" />;

  if (!rows.length) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-surfaceMuted text-xs uppercase tracking-wide text-textMuted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={clsx("whitespace-nowrap px-3 py-3 font-semibold", column.className)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey ? rowKey(row, index) : row.id || row._id || index}
              className="border-t border-border bg-surface transition hover:bg-hover/60"
            >
              {columns.map((column) => (
                <td key={column.key} className={clsx("px-3 py-3 align-middle text-textSecondary", column.cellClassName)}>
                  {column.render ? column.render(row, index) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
