import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Page from "../../components/common/Page";
import StatCard from "../../components/Dashboard/StatCard";
import adminApi from "../../api/admin.api";
import tournamentApi from "../../api/tournament.api";
import { extractList } from "../../utils/errors";
import useAuth from "../../hooks/useAuth";

export function AdminShell({ title, children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const tabs = isAdmin
    ? [
        ["/admin", "Overview"],
        ["/admin/tournaments", "Tournaments"],
        ["/admin/matches", "Matches"],
        ["/admin/users", "Users"],
        ["/admin/results", "Results"],
      ]
    : [
        ["/moderator", "Overview"],
        ["/moderator/matches", "Matches"],
        ["/moderator/results", "Results"],
      ];

  return (
    <Page>
      <h1 className="text-2xl font-bold">{title}</h1>
      <nav className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin" || to === "/moderator"}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-primary text-textDark" : "bg-surface text-textSecondary"}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </Page>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, tournaments: 0, active: 0, live: 0, reports: 0 });

  useEffect(() => {
    Promise.all([
      adminApi.listUsers({ limit: 1 }),
      tournamentApi.list({ limit: 1 }),
      tournamentApi.list({ status: "live", limit: 1 }),
      tournamentApi.list({ status: "registration_open", limit: 1 }),
      adminApi.listReports({ limit: 1 }),
    ])
      .then(([users, all, live, open, reports]) => {
        setStats({
          users: extractList(users.data).pagination?.total || 0,
          tournaments: extractList(all.data).pagination?.total || 0,
          live: extractList(live.data).pagination?.total || 0,
          active: extractList(open.data).pagination?.total || 0,
          reports: extractList(reports.data).pagination?.total || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <AdminShell title="Admin">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total users" value={stats.users} />
        <StatCard label="Total tournaments" value={stats.tournaments} />
        <StatCard label="Active tournaments" value={stats.active} />
        <StatCard label="Live tournaments" value={stats.live} />
        <StatCard label="Pending reports" value={stats.reports} />
        <StatCard label="Pending results" value="Staff queue" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link className="text-primary" to="/admin/tournaments">Create tournament</Link>
        <Link className="text-primary" to="/admin/matches">Create match</Link>
        <Link className="text-primary" to="/admin/users">Manage users</Link>
      </div>
    </AdminShell>
  );
}
