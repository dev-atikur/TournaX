import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminShell } from "./AdminDashboardPage";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import adminApi from "../../api/admin.api";
import { extractList, getApiError } from "../../utils/errors";
import { entityId } from "../../utils/format";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const load = () => {
    adminApi
      .listUsers({ search, limit: 30 })
      .then((res) => setItems(extractList(res.data).items))
      .catch((err) => toast.error(getApiError(err)));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ban = async (id) => {
    try {
      await adminApi.banUser(id, { reason: "Violation of PWF rules" });
      toast.success("User banned");
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const unban = async (id) => {
    try {
      await adminApi.unbanUser(id);
      toast.success("User unbanned");
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const setRole = async (id, role) => {
    try {
      await adminApi.updateUserRole(id, role);
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <AdminShell title="Admin users">
      <div className="mb-4 flex gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" />
        <Button onClick={load}>Search</Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surfaceMuted text-textMuted">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={entityId(user)} className="border-t border-border">
                <td className="px-3 py-2">
                  {user.username}
                  <div className="text-xs text-textMuted">{user.email}</div>
                </td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{user.isBanned ? "Banned" : "Active"}</td>
                <td className="space-x-2 px-3 py-2">
                  {user.isBanned ? (
                    <button type="button" className="text-success" onClick={() => unban(entityId(user))}>Unban</button>
                  ) : (
                    <button type="button" className="text-error" onClick={() => ban(entityId(user))}>Ban</button>
                  )}
                  {user.role !== "admin" ? (
                    <button
                      type="button"
                      className="text-primary"
                      onClick={() => setRole(entityId(user), user.role === "moderator" ? "user" : "moderator")}
                    >
                      {user.role === "moderator" ? "Make user" : "Make moderator"}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
