import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, Pencil, ShieldAlert, UserRound } from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import Select from "../../components/common/Select";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import IconButton from "../../components/common/IconButton";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import BanBadge from "../../components/admin/BanBadge";
import BanUserModal from "../../components/admin/BanUserModal";
import BanDetailsModal from "../../components/admin/BanDetailsModal";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import adminApi from "../../api/admin.api";
import { extractList, getApiError } from "../../utils/errors";
import { avatarUrl, displayName, entityId, formatDate, getBanInfo, normalizePagination, shortId } from "../../utils/format";
import { USER_ROLES } from "../../utils/constants";
import useStaff from "../../hooks/useStaff";

export default function AdminUsersPage() {
  const staff = useStaff();
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    banned: "",
    page: 1,
    limit: 12,
  });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [banUser, setBanUser] = useState(null);
  const [banMode, setBanMode] = useState("ban");
  const [banDetails, setBanDetails] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [roleValue, setRoleValue] = useState("user");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.role) delete params.role;
      if (!params.status) delete params.status;
      if (!params.banned) delete params.banned;
      const res = await adminApi.listUsers(params);
      const result = extractList(res.data);
      setItems(result.items);
      setPagination(normalizePagination(result.pagination, filters));
    } catch (err) {
      setError(getApiError(err, "Could not load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, filters.search ? 250 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const saveRole = async () => {
    try {
      await adminApi.updateUserRole(entityId(roleUser), roleValue);
      toast.success("Role updated");
      setRoleUser(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-textMuted">Search players, review bans, and keep the lobby clean.</p>
      </div>
      <FilterBar>
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            placeholder="Name, email, username, FF name, FF UID"
          />
        </div>
        <Select value={filters.role} onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value, page: 1 }))}>
          <option value="">All roles</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </Select>
        <Select value={filters.banned} onChange={(e) => setFilters((p) => ({ ...p, banned: e.target.value, page: 1 }))}>
          <option value="">Ban status</option>
          <option value="false">Not banned</option>
          <option value="true">Banned</option>
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
        </Select>
      </FilterBar>

      <div className="mt-4">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <Table
            loading={loading}
            rows={items}
            emptyTitle="No users found."
            emptyDescription="Try another name, UID, or ban filter."
            rowKey={(row) => entityId(row)}
            columns={[
              { key: "id", label: "ID", render: (row) => <span className="font-mono text-xs">{shortId(entityId(row))}</span> },
              {
                key: "user",
                label: "User",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <img src={avatarUrl(row)} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-textPrimary">{displayName(row)}</p>
                      <p className="text-xs text-textMuted">@{row.username} · {row.email}</p>
                    </div>
                  </div>
                ),
              },
              { key: "ff", label: "FF Name", render: (row) => row.ffName || "—" },
              { key: "role", label: "Role", render: (row) => <StatusBadge status={row.role} /> },
              {
                key: "status",
                label: "Status",
                render: (row) => <BanBadge user={row} compact />,
              },
              { key: "joined", label: "Joined Date", render: (row) => formatDate(row.createdAt) },
              {
                key: "actions",
                label: "Actions",
                render: (row) => {
                  const ban = getBanInfo(row);
                  return (
                    <div className="flex gap-1">
                      <IconButton title="View" onClick={() => setSelected(row)}>
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      {staff.canChangeRole ? (
                        <IconButton
                          title="Change role"
                          onClick={() => {
                            setRoleUser(row);
                            setRoleValue(row.role);
                          }}
                        >
                          <UserRound className="h-4 w-4" />
                        </IconButton>
                      ) : null}
                      {ban.isBanned ? (
                        <IconButton title="Ban details" tone="danger" onClick={() => setBanDetails(row)}>
                          <ShieldAlert className="h-4 w-4" />
                        </IconButton>
                      ) : staff.canBanUsers ? (
                        <IconButton
                          title="Ban"
                          tone="danger"
                          onClick={() => {
                            setBanMode("ban");
                            setBanUser(row);
                          }}
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </IconButton>
                      ) : null}
                      {staff.canEditUsers ? (
                        <IconButton title="Edit" tone="primary" onClick={() => setSelected(row)}>
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                      ) : null}
                    </div>
                  );
                },
              },
            ]}
          />
        )}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />

      <UserDetailsModal
        open={Boolean(selected)}
        user={selected}
        onClose={() => setSelected(null)}
        onBan={() => {
          setBanMode("ban");
          setBanUser(selected);
        }}
        onUnban={() => setBanDetails(selected)}
        onRefresh={load}
      />
      <BanUserModal
        open={Boolean(banUser)}
        user={banUser}
        mode={banMode}
        onClose={() => setBanUser(null)}
        onDone={load}
      />
      <BanDetailsModal
        open={Boolean(banDetails)}
        user={banDetails}
        onClose={() => setBanDetails(null)}
        onUnban={load}
        onExtend={() => {
          setBanMode("extend");
          setBanUser(banDetails);
        }}
        onChange={() => {
          setBanMode("change");
          setBanUser(banDetails);
        }}
      />
      <ConfirmDialog
        open={Boolean(roleUser)}
        title="Change role?"
        confirmLabel="Update role"
        tone="primary"
        onClose={() => setRoleUser(null)}
        onConfirm={saveRole}
      >
        <Select value={roleValue} onChange={(e) => setRoleValue(e.target.value)}>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
      </ConfirmDialog>
    </div>
  );
}
