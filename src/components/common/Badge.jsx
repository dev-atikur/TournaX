import { clsx } from "clsx";

const tones = {
  default: "border-border bg-surfaceMuted text-textSecondary",
  primary: "border-primary/20 bg-primary/10 text-primary",
  success: "border-success/20 bg-successSoft text-success",
  warning: "border-warning/20 bg-warningSoft text-warning",
  error: "border-error/20 bg-errorSoft text-error",
  info: "border-info/20 bg-infoSoft text-info",
};

export default function Badge({ tone = "default", className, children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone] || tones.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
