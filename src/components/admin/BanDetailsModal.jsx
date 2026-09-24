import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import Button from "../common/Button";
import BanBadge from "./BanBadge";
import ConfirmDialog from "../common/ConfirmDialog";
import adminApi from "../../api/admin.api";
import { avatarUrl, displayName, entityId, formatDateTime, getBanInfo } from "../../utils/format";
import { getApiError } from "../../utils/errors";
import StatusBadge from "../common/StatusBadge";

const TABS = [
  ["details", "Ban Details"],
  ["info", "User Info"],
  ["activity", "Activity"],
];

export default function BanDetailsModal({
  open,
  user,
  activity = [],
  onClose,
  onUnban,
  onExtend,
  onChange,
}) {
  const [tab, setTab] = useState("details");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const ban = getBanInfo(user);

  const unban = async () => {
    setLoading(true);
    try {
      await adminApi.unbanUser(entityId(user));
      toast.success("User unbanned");
      setConfirm(false);
      onUnban?.();
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not unban user"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Modal
        open={open}
        title="User Ban Details"
        size="lg"
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="secondary" onClick={onChange}>
              Change Ban
            </Button>
            {ban.type === "temporary" ? (
              <Button variant="outline" onClick={onExtend}>
                Extend Ban
              </Button>
            ) : null}
            <Button variant="danger" onClick={() => setConfirm(true)}>
              Unban
            </Button>
          </>
        }
      >
        <div className="mb-4 flex gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-lg px-3 py-1.5 text-sm ${tab === id ? "bg-primary/15 text-primary" : "text-textMuted hover:bg-hover"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "details" ? (
          <div className="space-y-4">
            <BanBadge user={user} />
            {ban.notes ? (
              <div className="rounded-xl border border-border bg-surfaceSoft p-3 text-sm">
                <p className="text-xs uppercase tracking-wide text-textMuted">Notes</p>
                <p className="mt-1 text-textSecondary">{ban.notes}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {tab === "info" ? (
          <div className="flex items-start gap-4">
            <img src={avatarUrl(user)} alt="" className="h-16 w-16 rounded-full object-cover" />
            <dl className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-textMuted">Name</dt>
                <dd>{displayName(user)}</dd>
              </div>
              <div>
                <dt className="text-textMuted">Username</dt>
                <dd>@{user.username}</dd>
              </div>
              <div>
                <dt className="text-textMuted">Email</dt>
                <dd>{user.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-textMuted">FF UID</dt>
              </div>
              <div>
                <dt className="text-textMuted">Role</dt>
                <dd><StatusBadge status={user.role} /></dd>
              </div>
              <div>
                <dt className="text-textMuted">Joined</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
        {tab === "activity" ? (
          <ul className="space-y-2 text-sm">
            {activity.length ? (
              activity.map((item, index) => (
                <li key={item.id || index} className="rounded-xl border border-border bg-surfaceSoft px-3 py-2">
                  {item.message || item.action || "Account activity"}
                  <span className="ml-2 text-xs text-textMuted">{formatDateTime(item.createdAt)}</span>
                </li>
              ))
            ) : (
              <li className="text-textMuted">No recent account activity.</li>
            )}
          </ul>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={confirm}
        title="Unban this user?"
        confirmLabel="Unban"
        tone="primary"
        loading={loading}
        onClose={() => setConfirm(false)}
        onConfirm={unban}
      >
        <p className="text-sm text-textSecondary">
          This will restore access for {displayName(user)}. Current reason: {ban.reason || "—"}.
        </p>
      </ConfirmDialog>
    </>
  );
}
