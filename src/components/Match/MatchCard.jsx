import { Link } from "react-router-dom";
import TournamentStatus from "../Tournament/TournamentStatus";
import { entityId, formatDateTime } from "../../utils/format";

export default function MatchCard({ match }) {
  const id = entityId(match);
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-textMuted">Match #{match.matchNumber}</p>
          <h3 className="mt-1 text-lg font-semibold">{match.title}</h3>
        </div>
        <TournamentStatus status={match.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-textMuted">Mode</dt>
          <dd>{match.gameMode}</dd>
        </div>
        <div>
          <dt className="text-textMuted">Map</dt>
          <dd>{match.map || "Bermuda"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-textMuted">Scheduled</dt>
          <dd>{formatDateTime(match.scheduledAt)}</dd>
        </div>
      </dl>
      <Link
        to={`/matches/${id}`}
        className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primarySoft"
      >
        Open match
      </Link>
    </article>
  );
}
