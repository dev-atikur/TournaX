import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Ban, Eye, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Table from "../../components/common/Table";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import IconButton from "../../components/common/IconButton";
import MatchFormModal from "../../components/admin/MatchFormModal";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import BanUserModal from "../../components/admin/BanUserModal";
import tournamentApi from "../../api/tournament.api";
import matchApi from "../../api/match.api";
import { extractEntity, extractList, getApiError } from "../../utils/errors";
import { avatarUrl, displayName, entityId, formatDateTime, formatMoney } from "../../utils/format";
import useStaff from "../../hooks/useStaff";
import StatCard from "../../components/Dashboard/StatCard";

const TABS = ["Overview", "Participants", "Matches", "Results", "Statistics", "Activity"];

export default function AdminTournamentDetailsPage() {
  const { id } = useParams();
  const staff = useStaff();
  const [tab, setTab] = useState("Overview");
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchOpen, setMatchOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState(null);
  const [banUser, setBanUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [cup, people, rooms] = await Promise.all([
        tournamentApi.get(id),
        tournamentApi.participants(id, { limit: 100 }),
        matchApi.list({ tournamentId: id, limit: 50 }),
      ]);
      setTournament(extractEntity(cup.data));
      setParticipants(extractList(people.data).items);
      setMatches(extractList(rooms.data).items);
    } catch (err) {
      setError(getApiError(err, "Could not load tournament."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const removeParticipant = async () => {
    try {
      const user = removeUser.userId && typeof removeUser.userId === "object" ? removeUser.userId : removeUser;
      await tournamentApi.removeParticipant(id, entityId(user) || removeUser.userId);
      toast.success("Participant removed");
      setRemoveUser(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const cancelTournament = async () => {
    try {
      await tournamentApi.cancel(id);
      toast.success("Tournament cancelled");
      setCancelOpen(false);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!tournament) return <ErrorState title="Tournament not found" />;

  const playerOf = (item) => (item.userId && typeof item.userId === "object" ? item.userId : item);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-textMuted">Tournament</p>
          <h1 className="text-2xl font-bold">{tournament.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={tournament.status} />
            <StatusBadge status={tournament.gameMode} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {staff.canEditTournament ? (
            <Button variant="secondary" as={Link} to={`${staff.basePath}/tournaments/${id}/edit`}>
              Edit tournament
            </Button>
          ) : null}
          {staff.canManageMatches ? (
            <Button variant="secondary" onClick={() => setMatchOpen(true)}>
              Create match
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setTab("Participants")}>
            Manage participants
          </Button>
          <Button variant="secondary" as={Link} to={`${staff.basePath}/results`}>
            View results
          </Button>
          {staff.canDeleteTournament ? (
            <Button variant="danger" onClick={() => setCancelOpen(true)}>
              Cancel tournament
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-xl px-3 py-2 text-sm ${tab === item ? "bg-primary/15 text-primary" : "bg-surface text-textMuted"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="pwf-card p-5 lg:col-span-2">
            <p className="text-sm text-textSecondary">{tournament.description || "No description."}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-textMuted">Map</dt><dd>{tournament.map || "Bermuda"}</dd></div>
              <div><dt className="text-textMuted">Prize pool</dt><dd>{formatMoney(tournament.prizePool)}</dd></div>
              <div><dt className="text-textMuted">Entry fee</dt><dd>{formatMoney(tournament.entryFee)}</dd></div>
              <div><dt className="text-textMuted">Players</dt><dd>{participants.length}/{tournament.maxPlayers || 0}</dd></div>
              <div><dt className="text-textMuted">Registration</dt><dd>{formatDateTime(tournament.registrationStart)} → {formatDateTime(tournament.registrationEnd)}</dd></div>
              <div><dt className="text-textMuted">Event</dt><dd>{formatDateTime(tournament.tournamentStart)} → {formatDateTime(tournament.tournamentEnd)}</dd></div>
            </dl>
          </div>
          <div className="space-y-3">
            <StatCard label="Matches" value={matches.length} />
            <StatCard label="Participants" value={participants.length} />
            <StatCard label="Completed matches" value={matches.filter((item) => item.status === "completed").length} />
          </div>
        </div>
      ) : null}

      {tab === "Participants" ? (
        <Table
          rows={participants}
          emptyTitle="No participants yet."
          rowKey={(row, index) => entityId(row) || index}
          columns={[
            {
              key: "player",
              label: "Player",
              render: (row) => {
                const user = playerOf(row);
                return (
                  <div className="flex items-center gap-2">
                    <img src={avatarUrl(user)} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <span className="text-textPrimary">{displayName(user)}</span>
                  </div>
                );
              },
            },
            { key: "ffName", label: "FF Name", render: (row) => row.ffName || playerOf(row).ffName || "—" },
            { key: "joinedAt", label: "Joined At", render: (row) => formatDateTime(row.joinedAt || row.createdAt) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status || "active"} /> },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-1">
                  <IconButton title="View" onClick={() => setViewUser(playerOf(row))}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  {staff.canModerateParticipants ? (
                    <IconButton title="Remove" tone="danger" onClick={() => setRemoveUser(row)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  ) : null}
                  {staff.canBanUsers ? (
                    <IconButton title="Ban from tournament" tone="danger" onClick={() => setBanUser(playerOf(row))}>
                      <Ban className="h-4 w-4" />
                    </IconButton>
                  ) : null}
                </div>
              ),
            },
          ]}
        />
      ) : null}

      {tab === "Matches" ? (
        <Table
          rows={matches}
          emptyTitle="No matches yet."
          rowKey={(row) => entityId(row)}
          columns={[
            { key: "n", label: "#", render: (row) => row.matchNumber },
            { key: "title", label: "Title", render: (row) => row.title },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "map", label: "Map" },
            { key: "time", label: "Scheduled", render: (row) => formatDateTime(row.scheduledAt) },
          ]}
        />
      ) : null}

      {tab === "Results" ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-textMuted">
          Verified placements appear after staff publish match results. Open{" "}
          <Link className="text-primary" to={`${staff.basePath}/results`}>
            Results
          </Link>{" "}
          to verify submissions.
        </div>
      ) : null}

      {tab === "Statistics" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Fill rate" value={`${tournament.maxPlayers ? Math.round((participants.length / tournament.maxPlayers) * 100) : 0}%`} />
          <StatCard label="Matches live/done" value={`${matches.filter((m) => m.status === "live").length}/${matches.filter((m) => m.status === "completed").length}`} />
          <StatCard label="Prize pool" value={formatMoney(tournament.prizePool)} />
        </div>
      ) : null}

      {tab === "Activity" ? (
        <ul className="space-y-2 text-sm text-textMuted">
          <li>Created {formatDateTime(tournament.createdAt)}</li>
          <li>Updated {formatDateTime(tournament.updatedAt)}</li>
          <li>{participants.length} registered players</li>
        </ul>
      ) : null}

      <MatchFormModal
        open={matchOpen}
        tournaments={[tournament]}
        onClose={() => setMatchOpen(false)}
        onSaved={load}
      />
      <UserDetailsModal open={Boolean(viewUser)} user={viewUser} onClose={() => setViewUser(null)} />
      <BanUserModal open={Boolean(banUser)} user={banUser} onClose={() => setBanUser(null)} onDone={load} />
      <ConfirmDialog
        open={Boolean(removeUser)}
        title="Remove participant?"
        confirmLabel="Remove"
        onClose={() => setRemoveUser(null)}
        onConfirm={removeParticipant}
      >
        <p className="text-sm text-textSecondary">This player will lose their slot in {tournament.title}.</p>
      </ConfirmDialog>
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel tournament?"
        confirmLabel="Cancel tournament"
        onClose={() => setCancelOpen(false)}
        onConfirm={cancelTournament}
      >
        <p className="text-sm text-textSecondary">Players will no longer be able to compete in this event.</p>
      </ConfirmDialog>
    </div>
  );
}
