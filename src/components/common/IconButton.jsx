import { clsx } from "clsx";

export default function IconButton({ title, className, children, tone = "default", ...props }) {
  const tones = {
    default: "text-textSecondary hover:bg-hover hover:text-textPrimary",
    primary: "text-primary hover:bg-primary/10",
    danger: "text-error hover:bg-error/10",
    success: "text-success hover:bg-success/10",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={clsx(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
