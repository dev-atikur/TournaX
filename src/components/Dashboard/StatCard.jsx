export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-textMuted">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
      </div>
      <p className="mt-2 text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
