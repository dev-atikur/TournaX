import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  id,
  error,
  hint,
  children,
  className,
  containerClassName,
  icon: Icon = ChevronDown,
  disabled,
  ...props
}) {
  const selectId = id || props.name;
  return (
    <div className={clsx("w-full", containerClassName)}>
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-textSecondary">
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <select
          id={selectId}
          disabled={disabled}
          className={clsx(
            "w-full appearance-none rounded-xl border bg-surfaceHard py-3 pl-4 pr-10 text-sm text-textPrimary outline-none transition focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error
              ? "border-error focus:border-error focus:ring-error/10"
              : "border-border focus:border-primary focus:ring-primary/10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <Icon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted transition-transform duration-200" />
      </div>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
      {hint && !error ? <p className="mt-1.5 text-xs text-textMuted">{hint}</p> : null}
    </div>
  );
}

