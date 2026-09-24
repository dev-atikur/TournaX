import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, Pencil, Plus, Ban } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import StatusBadge from "../../components/common/StatusBadge";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import MatchFormModal from "../../components/admin/MatchFormModal";
import matchApi from "../../api/match.api";
import tournamentApi from "../../api/tournament.api";
import adminApi from "../../api/admin.api";
import { extractList, getApiError } from "../../utils/errors";
import { entityId, formatDateTime, formatStatus, normalizePagination } from "../../utils/format";
import { MATCH_STATUSES } from "../../utils/constants";
import useStaff from "../../hooks/useStaff";

export default function AdminMatchesPage() {
  const staff = useStaff();
  const [filters, setFilters] = useState({ search: "", status: "", tournamentId: "", page: 1, limit: 12 });
  const [items, setItems] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    tournamentApi.list({ limit: 50 }).then((res) => setTournaments(extractList(res.data).items)).catch(() => {});
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      if (!params.tournamentId) delete params.tournamentId;
      const res = await matchApi.list(params);
      const result = extractList(res.data);
      setItems(result.items);
      setPagination(normalizePagination(result.pagination, filters));
    } catch (err) {
      setError(getApiError(err, "Could not load matches."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, filters.search ? 250 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const cancelMatch = async () => {
    try {
      if (adminApi.cancelMatch) await adminApi.cancelMatch(entityId(cancelling));
      else await matchApi.update(entityId(cancelling), { status: "cancelled" });
      toast.success("Match cancelled");
      setCancelling(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Matches</h1>
          <p className="mt-1 text-sm text-textMuted">Schedule rooms and keep credentials staff-only until room ready.</p>
        </div>
        {staff.canManageMatches ? (
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" />
            Create match
          </Button>
        ) : null}
      </div>

      <FilterBar>
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Search matches"
          />
        </div>
        <Select value={filters.tournamentId} onChange={(e) => setFilters((p) => ({ ...p, tournamentId: e.target.value, page: 1 }))}>
          <option value="">All tournaments</option>
          {tournaments.map((item) => (
            <option key={entityId(item)} value={entityId(item)}>
              {item.title}
            </option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All statuses</option>
          {Object.values(MATCH_STATUSES).map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </Select>
        <Select
          value="scheduledAt:asc"
          onChange={() => setFilters((p) => ({ ...p, sort: "scheduledAt", order: "asc", page: 1 }))}
        >
          <option value="scheduledAt:asc">Schedule</option>
        </Select>
      </FilterBar>

      <div className="mt-4">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <Table
            loading={loading}
            rows={items}
            emptyTitle="No matches found."
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "n", label: "#", render: (row) => row.matchNumber },
              { key: "title", label: "Match", render: (row) => <span className="font-medium text-textPrimary">{row.title}</span> },
              { key: "cup", label: "Tournament", render: (row) => row.tournament?.title || row.tournamentTitle || "—" },
              { key: "mode", label: "Mode", render: (row) => row.gameMode },
              { key: "map", label: "Map" },
              { key: "time", label: "Scheduled", render: (row) => formatDateTime(row.scheduledAt) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <div className="flex gap-1">
                    <IconButton title="View" onClick={() => setViewing(row)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    {staff.canManageMatches ? (
                      <IconButton
                        title="Edit"
                        tone="primary"
                        onClick={() => {
                          setEditing(row);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                    {staff.canManageMatches ? (
                      <IconButton title="Cancel match" tone="danger" onClick={() => setCancelling(row)}>
                        <Ban className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />

      <MatchFormModal
        open={formOpen}
        match={editing}
        tournaments={tournaments}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
      <Modal open={Boolean(viewing)} title={viewing?.title || "Match"} onClose={() => setViewing(null)}>
        {viewing ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-textMuted">Status</dt><dd><StatusBadge status={viewing.status} /></dd></div>
            <div><dt className="text-textMuted">Mode</dt><dd>{viewing.gameMode}</dd></div>
            <div><dt className="text-textMuted">Map</dt><dd>{viewing.map}</dd></div>
            <div><dt className="text-textMuted">Scheduled</dt><dd>{formatDateTime(viewing.scheduledAt)}</dd></div>
            {viewing.status === "room_ready" || viewing.status === "live" ? (
              <>
                <div><dt className="text-textMuted">Room ID</dt><dd>{viewing.roomId || "Hidden until ready"}</dd></div>
                <div><dt className="text-textMuted">Password</dt><dd>{viewing.roomPassword || "—"}</dd></div>
              </>
            ) : (
              <p className="sm:col-span-2 text-textMuted">Room credentials stay hidden until the match is room ready.</p>
            )}
          </dl>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(cancelling)}
        title="Cancel this match?"
        confirmLabel="Cancel match"
        onClose={() => setCancelling(null)}
        onConfirm={cancelMatch}
      >
        <p className="text-sm text-textSecondary">{cancelling?.title} will be marked cancelled.</p>
      </ConfirmDialog>
    </div>
  );
}
