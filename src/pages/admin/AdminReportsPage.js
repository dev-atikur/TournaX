import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import IconButton from "../../components/common/IconButton";
import StatusBadge from "../../components/common/StatusBadge";
import ErrorState from "../../components/common/ErrorState";
import ReportDetailsModal from "../../components/admin/ReportDetailsModal";
import BanUserModal from "../../components/admin/BanUserModal";
import reportApi from "../../api/report.api";
import { extractList, getApiError } from "../../utils/errors";
import { displayName, entityId, formatDateTime, normalizePagination, shortId } from "../../utils/format";
import { REPORT_STATUSES, REPORT_TYPES } from "../../utils/constants";

export default function AdminReportsPage() {
  const [filters, setFilters] = useState({ search: "", type: "", status: "", page: 1, limit: 12 });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [banUser, setBanUser] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.type) delete params.type;
      if (!params.status) delete params.status;
      const res = await reportApi.list(params);
      const result = extractList(res.data);
      setItems(result.items);
      setPagination(normalizePagination(result.pagination, filters));
    } catch (err) {
      setError(getApiError(err, "Could not load reports."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, filters.search ? 250 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-textMuted">Manage and review user reports.</p>
      </div>
      <FilterBar>
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Search by user, reason, or report ID"
          />
        </div>
        <Select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value, page: 1 }))}>
          <option value="">All types</option>
          {REPORT_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All statuses</option>
          {Object.values(REPORT_STATUSES).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </Select>
        <Select
          value="createdAt:desc"
          onChange={() => setFilters((p) => ({ ...p, sort: "createdAt", order: "desc", page: 1 }))}
        >
          <option value="createdAt:desc">Newest</option>
        </Select>
      </FilterBar>
      <div className="mt-4">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <Table
            loading={loading}
            rows={items}
            emptyTitle="No reports found."
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "id", label: "Report ID", render: (row) => <span className="font-mono text-xs">{shortId(entityId(row))}</span> },
              { key: "reporter", label: "Reporter", render: (row) => displayName(row.reporter || row.reporterId) },
              { key: "reported", label: "Reported User", render: (row) => displayName(row.reportedUser || row.reportedUserId) },
              { key: "reason", label: "Reason", render: (row) => row.reason || row.type },
              { key: "type", label: "Type", render: (row) => row.type || row.reason },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
              { key: "created", label: "Created", render: (row) => formatDateTime(row.createdAt) },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <IconButton title="View" onClick={() => setSelected(row)}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                ),
              },
            ]}
          />
        )}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />
      <ReportDetailsModal
        open={Boolean(selected)}
        report={selected}
        onClose={() => setSelected(null)}
        onChanged={load}
        onBan={() => setBanUser(selected?.reportedUser || selected?.reportedUserId)}
      />
      <BanUserModal open={Boolean(banUser)} user={typeof banUser === "object" ? banUser : { _id: banUser }} onClose={() => setBanUser(null)} onDone={load} />
    </div>
  );
}
