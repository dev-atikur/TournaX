import { Link } from "react-router-dom";
import TournamentStatus from "../Tournament/TournamentStatus";
import { entityId, formatDateTime } from "../../utils/format";

export default function TournamentList({ items = [] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={entityId(item)} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-textMuted">{formatDateTime(item.tournamentStart)}</p>
            </div>
            <div className="flex items-center gap-3">
              <TournamentStatus status={item.status} />
              <Link to={`/tournaments/${entityId(item)}`} className="text-sm font-semibold text-primary">
                Open
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
