import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import Page from "../components/common/Page";
import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";
import MatchStatus from "../components/Match/MatchStatus";
import matchApi from "../api/match.api";
import tournamentApi from "../api/tournament.api";
import { extractEntity, getApiError } from "../utils/errors";
import { formatDateTime } from "../utils/format";

export default function MatchDetailsPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await matchApi.get(id);
        const data = extractEntity(response.data);
        if (!active) return;
        setMatch(data);
        if (data?.tournamentId) {
          try {
            const tournamentRes = await tournamentApi.get(data.tournamentId);
            if (active) setTournament(extractEntity(tournamentRes.data));
          } catch {
            setTournament(null);
          }
        }
      } catch (err) {
        if (active) setError(getApiError(err, "Match not found."));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Page>
        <Spinner className="min-h-[40vh]" />
      </Page>
    );
  }

  if (error || !match) {
    return (
      <Page>
        <ErrorState message={error} />
      </Page>
    );
  }

  const roomVisible = Boolean(match.roomId || match.roomPassword);

  return (
    <Page width="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-textMuted">Match #{match.matchNumber}</p>
          <h1 className="mt-2 text-2xl font-bold">{match.title}</h1>
          {tournament ? (
            <Link to={`/tournaments/${tournament.id || tournament._id}`} className="mt-2 inline-block text-sm text-primary">
              {tournament.title}
            </Link>
          ) : null}
        </div>
        <MatchStatus status={match.status} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Game mode", match.gameMode],
          ["Map", match.map],
          ["Scheduled", formatDateTime(match.scheduledAt)],
          ["Status", match.status],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-textMuted">{label}</p>
            <p className="mt-1 font-medium">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-semibold">Room information</h2>
        {roomVisible ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <p className="text-sm">Room ID: <span className="font-mono text-primary">{match.roomId}</span></p>
            <p className="text-sm">Password: <span className="font-mono text-primary">{match.roomPassword}</span></p>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-sm text-textMuted">
            <Lock className="h-4 w-4" />
            Room ID and password are hidden until the match is ready and you are registered.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Participants</h2>
        <p className="mt-2 text-sm text-textMuted">
          {Array.isArray(match.participants) ? `${match.participants.length} players assigned to this room.` : "Participant list will appear when the lobby is locked."}
        </p>
      </section>

      {match.status === "completed" ? (
        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-semibold">Results</h2>
          <p className="mt-2 text-sm text-textMuted">
            Verified results are published on the tournament leaderboard after staff review.
          </p>
          {tournament ? (
            <Link className="mt-3 inline-block text-sm text-primary" to={`/leaderboard?tournament=${tournament.id || tournament._id}`}>
              View tournament leaderboard
            </Link>
          ) : null}
        </section>
      ) : null}
    </Page>
  );
}
