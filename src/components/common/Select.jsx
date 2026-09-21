import { clsx } from "clsx";

export default function Select({ label, id, error, children, className, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-textSecondary">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={clsx(
          "w-full rounded-xl border bg-surfaceHard px-4 py-3 text-sm text-textPrimary outline-none transition focus:ring-2",
          error
            ? "border-error focus:border-error focus:ring-error/10"
            : "border-border focus:border-primary focus:ring-primary/10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}
