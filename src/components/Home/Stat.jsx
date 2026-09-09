export default function Stat({ value, label }) {
  return (
    <div className="px-5 py-6 text-center">
      <p className="text-xl font-bold text-primary sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-textMuted sm:text-sm">{label}</p>
    </div>
  );
}
