import StatusBadge from "../common/StatusBadge";
import { formatDateTime, remainingTime } from "../../utils/format";
import { getBanInfo } from "../../utils/format";

export default function BanBadge({ user, compact = false }) {
  const ban = getBanInfo(user);
  if (!ban.isBanned) {
    return <StatusBadge status="active">Active</StatusBadge>;
  }

  if (compact) {
    return <StatusBadge status={ban.type || "banned"}>{ban.type === "temporary" ? "Temp Ban" : "Banned"}</StatusBadge>;
  }

  return (
    <div className="rounded-2xl border border-error/30 bg-errorSoft/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status="banned">Banned</StatusBadge>
        <StatusBadge status={ban.type}>{ban.type === "temporary" ? "Temporary Ban" : "Permanent Ban"}</StatusBadge>
      </div>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-textMuted">Reason</dt>
          <dd className="text-right text-textPrimary">{ban.reason || "Not specified"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-textMuted">Banned by</dt>
          <dd className="text-right text-textPrimary">
            {ban.bannedBy?.fullName || ban.bannedBy?.username || ban.bannedBy || "Staff"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-textMuted">Banned at</dt>
          <dd className="text-right text-textPrimary">{formatDateTime(ban.bannedAt)}</dd>
        </div>
        {ban.type === "temporary" ? (
          <>
            <div className="flex justify-between gap-3">
              <dt className="text-textMuted">Expires</dt>
              <dd className="text-right text-textPrimary">{formatDateTime(ban.expiresAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-textMuted">Remaining</dt>
              <dd className="text-right font-semibold text-warning">{remainingTime(ban.expiresAt)}</dd>
            </div>
          </>
        ) : (
          <div className="flex justify-between gap-3">
            <dt className="text-textMuted">Expiry</dt>
            <dd className="text-right text-textPrimary">No expiry date</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
