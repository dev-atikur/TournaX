import { Search } from "lucide-react";
import { GAME_MODES, TOURNAMENT_STATUSES } from "../../utils/constants";
import { formatStatus } from "../../utils/format";

const STATUSES = [
  { value: "", label: "All statuses" },
  ...Object.values(TOURNAMENT_STATUSES)
    .filter((status) => status !== "draft")
    .map((status) => ({ value: status, label: formatStatus(status) })),
];

export default function TournamentFilters({
  search,
  status,
  gameMode,
  sort,
  order,
  onChange,
}) {
  const set = (key, value) => onChange({ [key]: value, page: 1 });

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 lg:grid-cols-5">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
        <input
          type="search"
          value={search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search tournaments..."
          aria-label="Search tournaments"
          className="w-full rounded-xl border border-border bg-surfaceHard py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <select
        value={status}
        onChange={(e) => set("status", e.target.value)}
        aria-label="Filter by status"
        className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm outline-none focus:border-primary"
      >
        {STATUSES.map((item) => (
          <option key={item.value || "all"} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        value={gameMode}
        onChange={(e) => set("gameMode", e.target.value)}
        aria-label="Filter by game mode"
        className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm outline-none focus:border-primary"
      >
        <option value="">All modes</option>
        {GAME_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
      <select
        value={`${sort}:${order}`}
        onChange={(e) => {
          const [nextSort, nextOrder] = e.target.value.split(":");
          onChange({ sort: nextSort, order: nextOrder, page: 1 });
        }}
        aria-label="Sort tournaments"
        className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm outline-none focus:border-primary"
      >
        <option value="createdAt:desc">Newest</option>
        <option value="start:asc">Start time</option>
        <option value="prizePool:desc">Prize pool</option>
      </select>
    </div>
  );
}
