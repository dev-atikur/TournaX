import Spinner from "./Spinner";
import { SkeletonCard } from "./Skeleton";

export default function LoadingState({ label = "Loading", variant = "spinner", cards = 3 }) {
  if (variant === "cards") {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-lg bg-surfaceMuted" />
        ))}
      </div>
    );
  }

  return <Spinner className="min-h-[240px]" label={label} />;
}
