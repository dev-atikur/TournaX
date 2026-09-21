import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Trophy, Users } from "lucide-react";
import Page from "../components/common/Page";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";
import ParticipantList from "../components/Tournament/ParticipantList";
import TournamentStatus from "../components/Tournament/TournamentStatus";
import tournamentApi from "../api/tournament.api";
import { extractEntity, extractList, getApiError } from "../utils/errors";
import { formatDateTime, formatMoney } from "../utils/format";
import { TOURNAMENT_STATUSES } from "../utils/constants";
import useAuth from "../hooks/useAuth";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [detailRes, peopleRes] = await Promise.all([
        tournamentApi.get(id),
        tournamentApi.participants(id, { limit: 50 }),
      ]);
      setTournament(extractEntity(detailRes.data));
      setParticipants(extractList(peopleRes.data).items);
    } catch (err) {
      setError(getApiError(err, "Tournament not found."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const registered = useMemo(() => {
    const uid = user?.id || user?._id;
    return participants.some((item) => {
      const participantUser = item.userId;
      const participantId =
        typeof participantUser === "object" ? participantUser.id || participantUser._id : participantUser;
      return String(participantId) === String(uid);
    });
  }, [participants, user]);

  const isFull = Number(tournament?.currentPlayers || 0) >= Number(tournament?.maxPlayers || 0);
  const open = tournament?.status === TOURNAMENT_STATUSES.REGISTRATION_OPEN;

  const primaryLabel = () => {
    if (registered) return "Registered";
    if (tournament?.status === TOURNAMENT_STATUSES.LIVE) return "Live";
    if (tournament?.status === TOURNAMENT_STATUSES.COMPLETED) return "Completed";
    if (tournament?.status === TOURNAMENT_STATUSES.CANCELLED) return "Cancelled";
    if (!open) return "Registration Closed";
    if (isFull) return "Tournament Full";
    return "Join Tournament";
  };

  const canJoin = open && !isFull && !registered;

  const join = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/tournaments/${id}` } });
      return;
    }
    setJoining(true);
    try {
      await tournamentApi.register(id);
      toast.success("Tournament joined");
      await load();
    } catch (err) {
      toast.error(getApiError(err, "Tournament registration failed"));
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <Spinner className="min-h-[40vh]" />
      </Page>
    );
  }

  if (error || !tournament) {
    return (
      <Page>
        <ErrorState message={error} onRetry={load} />
      </Page>
    );
  }

  return (
    <Page>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-surfaceElevated to-background sm:h-56">
          {tournament.banner ? (
            <img src={tournament.banner} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,184,0,0.2),transparent_40%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <TournamentStatus status={tournament.status} />
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{tournament.title}</h1>
          </div>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-sm leading-7 text-textSecondary">{tournament.description || "No description provided."}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Mode", tournament.gameMode],
                ["Map", tournament.map],
                ["Prize pool", formatMoney(tournament.prizePool)],
                ["Entry fee", formatMoney(tournament.entryFee)],
                ["Players", `${tournament.currentPlayers || 0} / ${tournament.maxPlayers}`],
                ["Registration ends", formatDateTime(tournament.registrationEnd)],
                ["Starts", formatDateTime(tournament.tournamentStart)],
                ["Ends", formatDateTime(tournament.tournamentEnd)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-surfaceHard p-3">
                  <p className="text-xs text-textMuted">{label}</p>
                  <p className="mt-1 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-semibold">Rules</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-textSecondary">
                {tournament.rules || "Follow Fair Play. No emulators unless listed. Be in the lobby 10 minutes early."}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold">Prize distribution</h2>
              {tournament.prizes?.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {tournament.prizes.map((prize) => (
                    <li key={prize.place} className="flex justify-between rounded-lg border border-border px-3 py-2">
                      <span>#{prize.place} {prize.title || ""}</span>
                      <span className="text-primary">{formatMoney(prize.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-textMuted">Prize split will be announced by staff.</p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Participants</h2>
              <ParticipantList participants={participants} />
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surfaceHard p-4">
            <div className="flex items-center gap-2 text-sm text-textMuted">
              <Trophy className="h-4 w-4 text-primary" />
              Tournament action
            </div>
            <Button className="mt-4 w-full" disabled={!canJoin} loading={joining} onClick={join}>
              {primaryLabel()}
            </Button>
            <Link to="/matches" className="mt-3 block text-center text-sm text-primary">
              Browse match types
            </Link>
            <div className="mt-4 space-y-2 text-sm text-textMuted">
              <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {tournament.currentPlayers || 0} registered</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {tournament.map}</p>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}
