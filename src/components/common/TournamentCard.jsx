import { Link } from "react-router-dom";

export default function TournamentCard({ title, type, prize, players, status }) {
  const isLive = status === "LIVE";

  return (
    <div className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:bg-surfaceSoft">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-surfaceSoft px-2.5 py-1 text-xs text-textMuted">
          {type}
        </span>

        <span
          className={`text-xs font-semibold ${
            isLive ? "text-success" : "text-primary"
          }`}
        >
          {isLive ? "● " : ""}
          {status}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-surfaceSoft p-3">
          <p className="text-xs text-textMuted">Prize Pool</p>
          <p className="mt-1 font-semibold text-primary">{prize}</p>
        </div>

        <div className="rounded-lg bg-surfaceSoft p-3">
          <p className="text-xs text-textMuted">Players</p>
          <p className="mt-1 font-semibold">{players}</p>
        </div>
      </div>

      <Link
        to="/tournaments"
        className="mt-5 block rounded-lg border border-border py-2.5 text-center text-sm font-medium transition group-hover:border-primary group-hover:text-primary"
      >
        View Tournament
      </Link>
    </div>
  );
}
