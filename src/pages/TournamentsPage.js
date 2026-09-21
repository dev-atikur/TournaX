import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trophy } from "lucide-react";
import Page from "../components/common/Page";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";
import { SkeletonCard } from "../components/common/Skeleton";
import TournamentCard from "../components/Tournament/TournamentCard";
import TournamentFilters from "../components/Tournament/TournamentFilters";
import tournamentApi from "../api/tournament.api";
import { extractList, getApiError } from "../utils/errors";
import useAuth from "../hooks/useAuth";

export default function TournamentsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    gameMode: "",
    sort: "createdAt",
    order: "desc",
    page: 1,
    limit: 9,
  });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState("");

  useEffect(() => {
    let active = true;
    const handle = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = { ...filters };
        if (!params.search) delete params.search;
        if (!params.status) delete params.status;
        if (!params.gameMode) delete params.gameMode;
        const response = await tournamentApi.list(params);
        if (!active) return;
        const result = extractList(response.data);
        setItems(result.items);
        setPagination(result.pagination);
      } catch (err) {
        if (active) setError(getApiError(err, "Could not load tournaments."));
      } finally {
        if (active) setLoading(false);
      }
    }, filters.search ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [filters]);

  const join = async (tournament) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/tournaments" } });
      return;
    }
    const id = tournament.id || tournament._id;
    setJoiningId(id);
    try {
      await tournamentApi.register(id);
      toast.success("Tournament joined");
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      toast.error(getApiError(err, "Tournament registration failed"));
    } finally {
      setJoiningId("");
    }
  };

  return (
    <Page>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Tournaments</h1>
        <p className="mt-1 text-sm text-textMuted">Discover Free Fire cups, filter by mode, and lock your slot.</p>
      </div>

      <TournamentFilters
        search={filters.search}
        status={filters.status}
        gameMode={filters.gameMode}
        sort={filters.sort}
        order={filters.order}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
      />

      <div className="mt-6">
        {error ? <ErrorState message={error} onRetry={() => setFilters((prev) => ({ ...prev }))} /> : null}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : items.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((tournament) => (
              <TournamentCard
                key={tournament.id || tournament._id}
                tournament={tournament}
                onJoin={join}
                joiningId={joiningId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="No tournaments found"
            description="Try another search, status, or game mode."
            actionLabel="Clear filters"
            onAction={() =>
              setFilters({ search: "", status: "", gameMode: "", sort: "createdAt", order: "desc", page: 1, limit: 9 })
            }
          />
        )}
      </div>

      <Pagination
        page={pagination?.page || filters.page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </Page>
  );
}
