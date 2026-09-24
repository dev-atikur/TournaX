import { clsx } from "clsx";

export default function Switch({ checked, onChange, label, description, disabled }) {
  return (
    <label className={clsx("flex items-start justify-between gap-4", disabled && "opacity-60")}>
      <span>
        <span className="block text-sm font-medium text-textPrimary">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-textMuted">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-primary" : "bg-surfaceMuted",
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
            checked ? "left-5" : "left-0.5",
          )}
        />
      </button>
    </label>
  );
}
