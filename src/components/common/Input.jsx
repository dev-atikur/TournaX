import { clsx } from "clsx";

export default function Input({
  label,
  id,
  error,
  hint,
  className,
  leftIcon,
  rightSlot,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-textSecondary">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted">
            {leftIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-surfaceHard py-3 pr-4 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:ring-2",
            leftIcon ? "pl-11" : "pl-4",
            rightSlot ? "pr-11" : "",
            error
              ? "border-error focus:border-error focus:ring-error/10"
              : "border-border focus:border-primary focus:ring-primary/10",
            className,
          )}
          {...props}
        />
        {rightSlot ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
      {hint && !error ? <p className="mt-1.5 text-xs text-textMuted">{hint}</p> : null}
    </div>
  );
}
