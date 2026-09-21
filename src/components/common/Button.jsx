import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-primary text-textDark hover:bg-primaryHover disabled:opacity-60",
  secondary:
    "border border-border bg-surface text-textPrimary hover:bg-hover",
  ghost: "text-textSecondary hover:bg-hover hover:text-textPrimary",
  danger: "bg-error text-white hover:bg-error/90",
};

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type,
  ...props
}) {
  return (
    <Component
      type={Component === "button" ? type || "button" : undefined}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </Component>
  );
}
