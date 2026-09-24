import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Coins, MapPin, Users } from "lucide-react";
import TournamentStatus from "./TournamentStatus";
import { entityId, formatDateTime, formatMoney, formatStatus } from "../../utils/format";
import { TOURNAMENT_STATUSES } from "../../utils/constants";

export default function TournamentCard({ tournament, onJoin, joiningId }) {
  const id = entityId(tournament);
  const canJoin = tournament.status === TOURNAMENT_STATUSES.REGISTRATION_OPEN;
  const isFull = Number(tournament.currentPlayers || 0) >= Number(tournament.maxPlayers || 0);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surfaceSoft">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-surfaceElevated via-surface to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,184,0,0.16),transparent_40%)]" />
        <div className="absolute left-4 top-4">
          <TournamentStatus status={tournament.status} />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium uppercase tracking-wide text-textMuted">
            {tournament.game || "Free Fire"} · {tournament.gameMode || "Solo"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-textPrimary">{tournament.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-borderSoft bg-surfaceHard p-3">
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Coins className="h-4 w-4 text-primary" />
              Prize pool
            </div>
            <p className="mt-1 font-bold text-primary">{formatMoney(tournament.prizePool)}</p>
          </div>
          <div className="rounded-xl border border-borderSoft bg-surfaceHard p-3">
            <div className="flex items-center gap-2 text-xs text-textMuted">
              <Coins className="h-4 w-4 text-secondarySoft" />
              Entry fee
            </div>
            <p className="mt-1 font-bold">{formatMoney(tournament.entryFee)}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5 text-sm">
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-textMuted">
              <Users className="h-4 w-4" /> Players
            </span>
            <span className="text-textSecondary">
              {tournament.currentPlayers || 0} / {tournament.maxPlayers || 0}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-textMuted">
              <MapPin className="h-4 w-4" /> Map
            </span>
            <span className="text-textSecondary">{tournament.map || "Bermuda"}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-textMuted">
              <CalendarDays className="h-4 w-4" /> Registration ends
            </span>
            <span className="text-right text-textSecondary">{formatDateTime(tournament.registrationEnd)}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-textMuted">
              <Clock3 className="h-4 w-4" /> Starts
            </span>
            <span className="text-right text-textSecondary">{formatDateTime(tournament.tournamentStart)}</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            to={`/tournaments/${id}`}
            className="inline-flex items-center justify-center rounded-xl border border-border py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            View details
          </Link>
          {canJoin && !isFull ? (
            <button
              type="button"
              onClick={() => onJoin?.(tournament)}
              disabled={joiningId === id}
              className="rounded-xl bg-primary py-2.5 text-sm font-bold text-textDark hover:bg-primaryHover disabled:opacity-60"
            >
              {joiningId === id ? "Joining..." : "Join"}
            </button>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl bg-surfaceMuted py-2.5 text-sm text-textMuted">
              {isFull ? "Tournament full" : formatStatus(tournament.status)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
