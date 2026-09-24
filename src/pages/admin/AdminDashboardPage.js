import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flag, Swords, Trophy, UserCheck, UserMinus, Users } from "lucide-react";
import StatCard from "../../components/Dashboard/StatCard";
import Table from "../../components/common/Table";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import StatusBadge from "../../components/common/StatusBadge";
import BanBadge from "../../components/admin/BanBadge";
import adminApi from "../../api/admin.api";
import tournamentApi from "../../api/tournament.api";
import matchApi from "../../api/match.api";
import reportApi from "../../api/report.api";
import { extractEntity, extractList, getApiError } from "../../utils/errors";
import { displayName, entityId, formatDateTime, shortId } from "../../utils/format";
import useStaff from "../../hooks/useStaff";

export default function AdminDashboardPage() {
  const staff = useStaff();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ tournaments: [], users: [], reports: [], results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      let nextStats = null;
      try {
        nextStats = extractEntity((await adminApi.getStats()).data);
      } catch {
        const [users, banned, allCups, liveCups, doneCups, matches, reports] = await Promise.all([
          adminApi.listUsers({ limit: 1 }),
          adminApi.listUsers({ limit: 1, banned: true }).catch(() => ({ data: {} })),
          tournamentApi.list({ limit: 1 }),
          tournamentApi.list({ status: "live", limit: 1 }),
          tournamentApi.list({ status: "completed", limit: 1 }),
          matchApi.list({ status: "scheduled", limit: 1 }).catch(() => ({ data: {} })),
          reportApi.pending(),
        ]);
        nextStats = {
          totalUsers: extractList(users.data).pagination?.total || 0,
          activeUsers: extractList(users.data).pagination?.total || 0,
          bannedUsers: extractList(banned.data).pagination?.total || 0,
          totalTournaments: extractList(allCups.data).pagination?.total || 0,
          liveTournaments: extractList(liveCups.data).pagination?.total || 0,
          completedTournaments: extractList(doneCups.data).pagination?.total || 0,
          upcomingMatches: extractList(matches.data).pagination?.total || 0,
          pendingReports: extractList(reports.data).pagination?.total || 0,
        };
      }

      const [tournaments, users, reports] = await Promise.all([
        tournamentApi.list({ limit: 5, sort: "createdAt", order: "desc" }),
        adminApi.listUsers({ limit: 5 }),
        reportApi.list({ limit: 5 }),
      ]);
      setStats(nextStats);
      setRecent({
        tournaments: extractList(tournaments.data).items,
        users: extractList(users.data).items,
        reports: extractList(reports.data).items,
        results: nextStats?.recentResults || [],
      });
    } catch (err) {
      setError(getApiError(err, "Could not load staff dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{staff.isAdmin ? "Admin dashboard" : "Moderator dashboard"}</h1>
        <p className="mt-1 text-sm text-textMuted">Live operations for Play With Fair tournaments.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Active users" value={stats.activeUsers ?? Math.max(0, (stats.totalUsers || 0) - (stats.bannedUsers || 0))} icon={UserCheck} />
        <StatCard label="Banned users" value={stats.bannedUsers} icon={UserMinus} />
        <StatCard label="Total tournaments" value={stats.totalTournaments} icon={Trophy} />
        <StatCard label="Live tournaments" value={stats.liveTournaments} icon={Trophy} />
        <StatCard label="Completed tournaments" value={stats.completedTournaments} icon={Trophy} />
        <StatCard label="Upcoming matches" value={stats.upcomingMatches} icon={Swords} />
        <StatCard label="Pending reports" value={stats.pendingReports} icon={Flag} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Panel title="Recent tournaments" to={`${staff.basePath}/tournaments`}>
          <Table
            emptyTitle="No tournaments found."
            rows={recent.tournaments}
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "title", label: "Tournament", render: (row) => row.title },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
              { key: "start", label: "Start", render: (row) => formatDateTime(row.tournamentStart) },
            ]}
          />
        </Panel>
        <Panel title="Recent users" to={`${staff.basePath}/users`}>
          <Table
            emptyTitle="No users found."
            rows={recent.users}
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "user", label: "User", render: (row) => displayName(row) },
              { key: "role", label: "Role", render: (row) => <StatusBadge status={row.role} /> },
              { key: "ban", label: "Status", render: (row) => <BanBadge user={row} compact /> },
            ]}
          />
        </Panel>
        <Panel title="Recent reports" to={`${staff.basePath}/reports`}>
          <Table
            emptyTitle="No reports found."
            rows={recent.reports}
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "id", label: "ID", render: (row) => shortId(entityId(row)) },
              { key: "reason", label: "Reason", render: (row) => row.reason || row.type },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </Panel>
        <Panel title="Recent match results" to={`${staff.basePath}/results`}>
          <Table
            emptyTitle="No pending results."
            rows={recent.results}
            rowKey={(row, index) => entityId(row) || index}
            columns={[
              { key: "match", label: "Match", render: (row) => row.matchTitle || row.matchId || "Match" },
              { key: "player", label: "Player", render: (row) => displayName(row.user || row) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status || "pending"} /> },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, to, children }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Link to={to} className="text-xs font-medium text-primary">
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}
