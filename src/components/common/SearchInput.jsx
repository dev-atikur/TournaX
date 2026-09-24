import { Search } from "lucide-react";
import { clsx } from "clsx";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
  id,
  ...props
}) {
  return (
    <div className={clsx("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surfaceHard py-2.5 pl-11 pr-4 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:border-primary focus:ring-2 focus:ring-primary/10"
        {...props}
      />
    </div>
  );
}
