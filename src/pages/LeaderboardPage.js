import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Page from "../components/common/Page";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import LeaderboardTable from "../components/Leaderboard/LeaderboardTable";
import leaderboardApi from "../api/leaderboard.api";
import tournamentApi from "../api/tournament.api";
import { extractList, getApiError } from "../utils/errors";
import { useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [scope, setScope] = useState(params.get("tournament") ? "tournament" : "global");
  const [tournamentId, setTournamentId] = useState(params.get("tournament") || "");
  const [tournaments, setTournaments] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    tournamentApi
      .list({ limit: 50, sort: "start", order: "desc" })
      .then((res) => setTournaments(extractList(res.data).items))
      .catch(() => setTournaments([]));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response =
          scope === "tournament" && tournamentId
            ? await leaderboardApi.tournament(tournamentId, { page, limit: 20 })
            : await leaderboardApi.global({ page, limit: 20 });
        if (!active) return;
        const result = extractList(response.data);
        setRows(result.items);
        setPagination(result.pagination);
      } catch (err) {
        if (active) setError(getApiError(err, "Could not load leaderboard."));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [scope, tournamentId, page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.username?.toLowerCase().includes(q) ||
        row.ffName?.toLowerCase().includes(q),
    );
  }, [rows, search]);

  return (
    <Page>
      <h1 className="text-2xl font-bold sm:text-3xl">Leaderboard</h1>
      <p className="mt-1 text-sm text-textMuted">Global ranking and per-tournament standings from verified results.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <select
          value={scope}
          onChange={(e) => {
            setScope(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm"
          aria-label="Leaderboard type"
        >
          <option value="global">Global leaderboard</option>
          <option value="tournament">Tournament leaderboard</option>
        </select>
        {scope === "tournament" ? (
          <select
            value={tournamentId}
            onChange={(e) => {
              setTournamentId(e.target.value);
              setParams(e.target.value ? { tournament: e.target.value } : {});
              setPage(1);
            }}
            className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm md:col-span-2"
            aria-label="Select tournament"
          >
            <option value="">Select a tournament</option>
            {tournaments.map((item) => (
              <option key={item.id || item._id} value={item.id || item._id}>
                {item.title}
              </option>
            ))}
          </select>
        ) : (
          <div className="md:col-span-2" />
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player"
            aria-label="Search player"
            className="w-full rounded-xl border border-border bg-surfaceHard py-3 pl-10 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner className="min-h-[30vh]" />
        ) : error ? (
          <EmptyState title="No leaderboard results" description={error} />
        ) : filtered.length ? (
          <LeaderboardTable rows={filtered} highlightId={user?.id || user?._id} />
        ) : (
          <EmptyState title="No leaderboard results" description="Play verified matches to appear here." />
        )}
      </div>
      <Pagination page={pagination?.page || page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
    </Page>
  );
}
