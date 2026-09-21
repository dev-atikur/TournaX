import { clsx } from "clsx";

export default function Skeleton({ className }) {
  return <div className={clsx("animate-pulse rounded-xl bg-surfaceMuted", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-5 h-10 w-full" />
    </div>
  );
}
