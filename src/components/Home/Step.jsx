export default function Step({ number, title, description }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <span className="text-sm font-bold text-primary">{number}</span>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-textMuted">{description}</p>
    </div>
  );
}