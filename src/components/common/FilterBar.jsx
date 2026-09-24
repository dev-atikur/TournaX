export default function FilterBar({ children }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-5">
      {children}
    </div>
  );
}
