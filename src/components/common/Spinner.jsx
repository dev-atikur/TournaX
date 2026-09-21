import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function Spinner({ className, label = "Loading" }) {
  return (
    <div className={clsx("flex items-center justify-center gap-2 text-textMuted", className)} role="status">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
