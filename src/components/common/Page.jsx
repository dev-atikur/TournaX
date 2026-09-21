import { clsx } from "clsx";

export default function Page({ children, className, width = "max-w-7xl" }) {
  return (
    <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background text-textPrimary">
      <div className={clsx("mx-auto w-full px-4 py-6 sm:px-6 lg:px-8", width, className)}>{children}</div>
    </main>
  );
}
