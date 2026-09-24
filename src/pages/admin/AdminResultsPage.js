import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, Eye, Pencil, X } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import IconButton from "../../components/common/IconButton";
import StatusBadge from "../../components/common/StatusBadge";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import resultApi from "../../api/result.api";
import matchApi from "../../api/match.api";
import { extractList, getApiError } from "../../utils/errors";
import { displayName, entityId, formatDateTime, normalizePagination } from "../../utils/format";
import { RESULT_STATUSES } from "../../utils/constants";
import useStaff from "../../hooks/useStaff";

export default function AdminResultsPage() {
  const staff = useStaff();
  const [filters, setFilters] = useState({ search: "", status: "pending", page: 1, limit: 12 });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      const res = await resultApi.list(params);
      const result = extractList(res.data);
      setItems(result.items);
      setPagination(normalizePagination(result.pagination, filters));
    } catch (err) {
      setError(getApiError(err, "Could not load results. The results API may not be live yet."));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, filters.search ? 250 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const applyAction = async () => {
    try {
      const id = entityId(confirm.row);
      if (confirm.type === "verify") {
        try {
          await resultApi.verify(id);
        } catch {
          await matchApi.verifyResults(confirm.row.matchId || id);
        }
        toast.success("Result verified");
      } else {
        await resultApi.reject(id, { reason: "Rejected by staff" });
        toast.success("Result rejected");
      }
      setConfirm(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    try {
      await resultApi.update(entityId(editing), {
        placement: Number(editing.placement),
        kills: Number(editing.kills),
        points: Number(editing.points),
      });
      toast.success("Result updated");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="mt-1 text-sm text-textMuted">Verify placements before they hit the public leaderboard.</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.values(RESULT_STATUSES).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilters((p) => ({ ...p, status, page: 1 }))}
            className={`rounded-xl px-3 py-2 text-sm capitalize ${filters.status === status ? "bg-primary/15 text-primary" : "bg-surface text-textMuted"}`}
          >
            {status.replace("_", " ")} results
          </button>
        ))}
      </div>
      <FilterBar>
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Search match, player, tournament"
          />
        </div>
      </FilterBar>
      <div className="mt-4">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <Table
            loading={loading}
            rows={items}
            emptyTitle={filters.status === "pending" ? "No pending results." : "No results found."}
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "match", label: "Match", render: (row) => row.matchTitle || row.match?.title || row.matchId },
              { key: "cup", label: "Tournament", render: (row) => row.tournamentTitle || row.tournament?.title || "—" },
              { key: "player", label: "Player", render: (row) => displayName(row.user || row.player || row) },
              { key: "placement", label: "Placement", render: (row) => row.placement ?? row.rank },
              { key: "kills", label: "Kills", render: (row) => row.kills ?? 0 },
              { key: "points", label: "Points", render: (row) => row.points ?? 0 },
              { key: "by", label: "Submitted By", render: (row) => displayName(row.submittedBy) || row.submittedBy || "Player" },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status || "pending"} /> },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <div className="flex gap-1">
                    <IconButton title="View" onClick={() => setViewing(row)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    {staff.canPublishResults ? (
                      <>
                        <IconButton title="Verify" tone="success" onClick={() => setConfirm({ type: "verify", row })}>
                          <Check className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="Reject" tone="danger" onClick={() => setConfirm({ type: "reject", row })}>
                          <X className="h-4 w-4" />
                        </IconButton>
                        <IconButton title="Edit" tone="primary" onClick={() => setEditing({ ...row })}>
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                      </>
                    ) : null}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />

      <Modal open={Boolean(viewing)} title="Result details" onClose={() => setViewing(null)}>
        {viewing ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-textMuted">Player</dt><dd>{displayName(viewing.user || viewing)}</dd></div>
            <div><dt className="text-textMuted">Placement</dt><dd>{viewing.placement}</dd></div>
            <div><dt className="text-textMuted">Kills</dt><dd>{viewing.kills}</dd></div>
            <div><dt className="text-textMuted">Points</dt><dd>{viewing.points}</dd></div>
            <div><dt className="text-textMuted">Status</dt><dd><StatusBadge status={viewing.status} /></dd></div>
            <div><dt className="text-textMuted">Submitted</dt><dd>{formatDateTime(viewing.createdAt)}</dd></div>
          </dl>
        ) : null}
      </Modal>
      <Modal
        open={Boolean(editing)}
        title="Edit result"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button form="edit-result" type="submit">Save</Button>
          </>
        }
      >
        {editing ? (
          <form id="edit-result" onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-3">
            <Input label="Placement" type="number" value={editing.placement} onChange={(e) => setEditing((p) => ({ ...p, placement: e.target.value }))} />
            <Input label="Kills" type="number" value={editing.kills} onChange={(e) => setEditing((p) => ({ ...p, kills: e.target.value }))} />
            <Input label="Points" type="number" value={editing.points} onChange={(e) => setEditing((p) => ({ ...p, points: e.target.value }))} />
          </form>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.type === "verify" ? "Verify this result?" : "Reject this result?"}
        confirmLabel={confirm?.type === "verify" ? "Verify" : "Reject"}
        tone={confirm?.type === "verify" ? "primary" : "danger"}
        onClose={() => setConfirm(null)}
        onConfirm={applyAction}
      >
        <p className="text-sm text-textSecondary">
          {displayName(confirm?.row?.user || confirm?.row)} · placement {confirm?.row?.placement} · {confirm?.row?.kills} kills
        </p>
      </ConfirmDialog>
    </div>
  );
}
