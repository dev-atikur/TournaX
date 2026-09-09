import React, { useMemo, useState } from "react";
import {
  Search,
  Trophy,
  Users,
  CalendarDays,
  Clock3,
  Coins,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

const tournaments = [
  {
    id: 1,
    title: "TournaX Free Fire Championship",
    game: "Free Fire",
    status: "upcoming",
    prizePool: "৳10,000",
    entryFee: "৳50",
    players: "128/256",
    date: "12 Sep 2026",
    time: "08:00 PM",
  },
  {
    id: 2,
    title: "Friday Night Battle",
    game: "Free Fire",
    status: "live",
    prizePool: "৳5,000",
    entryFee: "৳30",
    players: "64/64",
    date: "09 Sep 2026",
    time: "09:00 PM",
  },
  {
    id: 3,
    title: "Bangladesh Pro League",
    game: "Free Fire",
    status: "upcoming",
    prizePool: "৳25,000",
    entryFee: "৳100",
    players: "180/256",
    date: "15 Sep 2026",
    time: "08:30 PM",
  },
  {
    id: 4,
    title: "Weekend Squad Clash",
    game: "Free Fire",
    status: "completed",
    prizePool: "৳8,000",
    entryFee: "৳40",
    players: "128/128",
    date: "06 Sep 2026",
    time: "07:30 PM",
  },
  {
    id: 5,
    title: "Elite Warriors Cup",
    game: "Free Fire",
    status: "upcoming",
    prizePool: "৳15,000",
    entryFee: "৳75",
    players: "96/128",
    date: "18 Sep 2026",
    time: "09:00 PM",
  },
  {
    id: 6,
    title: "Night Owls Tournament",
    game: "Free Fire",
    status: "live",
    prizePool: "৳3,000",
    entryFee: "৳20",
    players: "32/32",
    date: "09 Sep 2026",
    time: "10:00 PM",
  },
];

const statusConfig = {
  live: {
    label: "Live",
    className: "bg-errorSoft text-error border-error/20",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-primaryMuted/30 text-primarySoft border-primary/20",
  },
  completed: {
    label: "Completed",
    className: "bg-surfaceElevated text-textMuted border-border",
  },
};

function TournamentCard({ tournament }) {
  const status = statusConfig[tournament.status];

  return (
    <div className="group overflow-x-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-surfaceSoft">
      {/* Banner */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-surfaceElevated via-surface to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,184,0,0.18),transparent_35%)]" />

        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <Trophy className="h-6 w-6 text-primary" />
        </div>

        <div className="absolute right-4 top-4">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
          >
            {tournament.status === "live" && (
              <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-error" />
            )}

            {status.label}
          </span>
        </div>

        <div className="absolute bottom-4 left-5">
          <p className="text-xs font-medium text-textMuted">
            {tournament.game}
          </p>

          <h3 className="mt-1 max-w-[270px] text-lg font-bold text-textPrimary">
            {tournament.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Prize + Entry */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-borderSoft bg-surfaceHard p-3">
            <div className="flex items-center gap-2 text-textMuted">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-xs">Prize Pool</span>
            </div>

            <p className="mt-1 text-base font-bold text-primary">
              {tournament.prizePool}
            </p>
          </div>

          <div className="rounded-xl border border-borderSoft bg-surfaceHard p-3">
            <div className="flex items-center gap-2 text-textMuted">
              <Coins className="h-4 w-4 text-secondarySoft" />
              <span className="text-xs">Entry Fee</span>
            </div>

            <p className="mt-1 text-base font-bold text-textPrimary">
              {tournament.entryFee}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-textMuted">
              <Users className="h-4 w-4" />
              <span>Players</span>
            </div>

            <span className="font-medium text-textSecondary">
              {tournament.players}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-textMuted">
              <CalendarDays className="h-4 w-4" />
              <span>Date</span>
            </div>

            <span className="font-medium text-textSecondary">
              {tournament.date}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-textMuted">
              <Clock3 className="h-4 w-4" />
              <span>Time</span>
            </div>

            <span className="font-medium text-textSecondary">
              {tournament.time}
            </span>
          </div>
        </div>

        {/* Button */}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-textDark transition-colors hover:bg-primaryHover">
          View Tournament
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const matchesSearch =
        tournament.title.toLowerCase().includes(search.toLowerCase()) ||
        tournament.game.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" || tournament.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-textPrimary sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Tournaments</h1>

              <p className="mt-1 text-sm text-textMuted">
                Join tournaments and compete with other players.
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border bg-surface p-1.5">
            <div className="hidden items-center px-2 text-textMuted sm:flex">
              <SlidersHorizontal className="h-4 w-4" />
            </div>

            {[
              ["all", "All"],
              ["live", "Live"],
              ["upcoming", "Upcoming"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-primary text-textDark"
                    : "text-textMuted hover:bg-hover hover:text-textPrimary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredTournaments.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surfaceElevated">
              <Trophy className="h-6 w-6 text-textMuted" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-textPrimary">
              No tournaments found
            </h2>

            <p className="mt-1 text-sm text-textMuted">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
