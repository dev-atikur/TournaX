import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Select from "../common/Select";
import Input from "../common/Input";
import StatCard from "../Dashboard/StatCard";
import BanBadge from "./BanBadge";
import StatusBadge from "../common/StatusBadge";
import { avatarUrl, displayName, entityId, formatDateTime } from "../../utils/format";
import { USER_ROLES } from "../../utils/constants";
import adminApi from "../../api/admin.api";
import { getApiError } from "../../utils/errors";
import useStaff from "../../hooks/useStaff";

export default function UserDetailsModal({
  open,
  user,
  activity = { tournaments: [], matches: [], reports: [], account: [] },
  onClose,
  onBan,
  onUnban,
  onRefresh,
}) {
  const staff = useStaff();
  const [role, setRole] = useState(user?.role || "user");
  const [saving, setSaving] = useState(false);

  const changeRole = async () => {
    if (!staff.canChangeRole) return;
    setSaving(true);
    try {
      await adminApi.updateUserRole(entityId(user), role);
      toast.success("Role updated");
      onRefresh?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not update role"));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      open={open}
      title="User details"
      size="xl"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {user.isBanned || user.ban ? (
            <Button variant="outline" onClick={onUnban}>
              View ban
            </Button>
          ) : staff.canBanUsers ? (
            <Button variant="danger" onClick={onBan}>
              Ban user
            </Button>
          ) : null}
        </>
      }
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full shrink-0 rounded-2xl border border-border bg-surfaceSoft p-4 lg:w-64">
          <img src={avatarUrl(user)} alt="" className="mx-auto h-20 w-20 rounded-full object-cover" />
          <p className="mt-3 text-center font-semibold">{displayName(user)}</p>
          <p className="text-center text-sm text-textMuted">@{user.username}</p>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={user.role} />
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Email" value={user.email || ""} disabled />
            <Input label="Phone" value={user.phone || "Not set"} disabled />
            <Input label="FF Name" value={user.ffName || ""} disabled />
            <Input label="Joined" value={formatDateTime(user.createdAt)} disabled />
            <div className="rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm">
              <p className="text-textMuted">Verification</p>
              <p className="mt-1">
                Email {user.isEmailVerified ? "verified" : "unverified"} · Phone{" "}
                {user.isPhoneVerified ? "verified" : "unverified"}
              </p>
            </div>
          </div>
          <BanBadge user={user} />
          {staff.canChangeRole ? (
            <div className="flex items-end gap-2">
              <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                {USER_ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Button onClick={changeRole} loading={saving} size="sm">
                Save role
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Matches" value={user.totalMatches} />
        <StatCard label="Wins" value={user.totalWins} />
        <StatCard label="Kills" value={user.totalKills} />
        <StatCard label="Points" value={user.totalPoints} />
        <StatCard label="Cups played" value={user.tournamentsPlayed || user.totalTournaments} />
        <StatCard label="Cups won" value={user.tournamentsWon} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ActivityBlock title="Recent tournaments" items={activity.tournaments} />
        <ActivityBlock title="Recent matches" items={activity.matches} />
        <ActivityBlock title="Recent reports" items={activity.reports} />
        <ActivityBlock title="Account activity" items={activity.account} />
      </div>
    </Modal>
  );
}

function ActivityBlock({ title, items = [] }) {
  return (
    <div className="rounded-2xl border border-border bg-surfaceSoft p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-textMuted">
        {items.length ? (
          items.map((item, index) => (
            <li key={item.id || index}>{item.title || item.message || item.reason || "Entry"}</li>
          ))
        ) : (
          <li>No records yet.</li>
        )}
      </ul>
    </div>
  );
}
