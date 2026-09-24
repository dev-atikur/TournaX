import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Pencil, Trash2, Users, Plus } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import ErrorState from "../../components/common/ErrorState";
import TournamentForm from "../../components/admin/TournamentForm";
import tournamentApi from "../../api/tournament.api";
import { extractList, getApiError } from "../../utils/errors";
import { entityId, formatDateTime, formatMoney, normalizePagination, shortId } from "../../utils/format";
import { GAME_MODES, TOURNAMENT_STATUSES } from "../../utils/constants";
import useStaff from "../../hooks/useStaff";

export default function AdminTournamentsPage() {
  const staff = useStaff();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", status: "", gameMode: "", sort: "createdAt", order: "desc", page: 1, limit: 12 });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [pending, setPending] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      if (!params.gameMode) delete params.gameMode;
      const res = await tournamentApi.list(params);
      const result = extractList(res.data);
      setItems(result.items);
      setPagination(normalizePagination(result.pagination, filters));
    } catch (err) {
      setError(getApiError(err, "Could not load tournaments."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, filters.search ? 250 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const cancel = async () => {
    try {
      await tournamentApi.cancel(entityId(pending));
      toast.success("Tournament cancelled");
      setPending(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tournaments</h1>
          <p className="mt-1 text-sm text-textMuted">Create, schedule, and manage Free Fire cups.</p>
        </div>
        {staff.canCreateTournament ? (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create tournament
          </Button>
        ) : null}
      </div>

      <FilterBar>
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Search tournaments"
          />
        </div>
        <Select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All statuses</option>
          {Object.values(TOURNAMENT_STATUSES).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
        <Select value={filters.gameMode} onChange={(e) => setFilters((p) => ({ ...p, gameMode: e.target.value, page: 1 }))}>
          <option value="">All modes</option>
          {GAME_MODES.map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
        </Select>
        <Select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split(":");
            setFilters((p) => ({ ...p, sort, order, page: 1 }));
          }}
        >
          <option value="createdAt:desc">Newest</option>
          <option value="tournamentStart:asc">Start time</option>
          <option value="prizePool:desc">Prize pool</option>
        </Select>
      </FilterBar>

      <div className="mt-4">
        {error ? <ErrorState message={error} onRetry={load} /> : (
          <Table
            loading={loading}
            rows={items}
            emptyTitle="No tournaments found."
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "id", label: "ID", render: (row) => <span className="font-mono text-xs">{shortId(entityId(row))}</span> },
              { key: "title", label: "Tournament", render: (row) => <span className="font-medium text-textPrimary">{row.title}</span> },
              { key: "gameMode", label: "Game Mode" },
              { key: "map", label: "Map", render: (row) => row.map || "—" },
              { key: "prizePool", label: "Prize Pool", render: (row) => formatMoney(row.prizePool) },
              { key: "entryFee", label: "Entry Fee", render: (row) => formatMoney(row.entryFee) },
              {
                key: "players",
                label: "Players",
                render: (row) => `${row.currentPlayers || row.participantsCount || 0}/${row.maxPlayers || 0}`,
              },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
              { key: "start", label: "Start Time", render: (row) => formatDateTime(row.tournamentStart) },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <div className="flex items-center gap-1">
                    <IconButton title="View" onClick={() => navigate(`${staff.basePath}/tournaments/${entityId(row)}`)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    {staff.canEditTournament ? (
                      <IconButton title="Edit" tone="primary" onClick={() => navigate(`${staff.basePath}/tournaments/${entityId(row)}/edit`)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                    <IconButton title="Manage" onClick={() => navigate(`${staff.basePath}/tournaments/${entityId(row)}`)}>
                      <Users className="h-4 w-4" />
                    </IconButton>
                    {staff.canDeleteTournament ? (
                      <IconButton title="Delete / Cancel" tone="danger" onClick={() => setPending(row)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={(page) => setFilters((p) => ({ ...p, page }))}
      />

      <Modal open={createOpen} title="Create tournament" size="xl" onClose={() => setCreateOpen(false)}>
        <TournamentForm
          onSuccess={() => {
            setCreateOpen(false);
            load();
          }}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Cancel this tournament?"
        confirmLabel="Cancel tournament"
        onClose={() => setPending(null)}
        onConfirm={cancel}
      >
        <p className="text-sm text-textSecondary">
          {pending?.title} will be marked cancelled. Registered players should be notified by the backend.
        </p>
      </ConfirmDialog>
    </div>
  );
}
