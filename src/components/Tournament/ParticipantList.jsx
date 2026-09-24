import { useState } from "react";
import { Link } from "react-router-dom";
import { entityId } from "../../utils/format";
import ReportUserModal from "../admin/ReportUserModal";
import useAuth from "../../hooks/useAuth";
import { profilePath } from "../../utils/profile";

export default function ParticipantList({ participants = [] }) {
  const { user, isAuthenticated } = useAuth();
  const [reportTarget, setReportTarget] = useState(null);

  if (!participants.length) {
    return <p className="text-sm text-textMuted">No participants yet.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {participants.map((item, index) => {
          const participantUser = item.userId && typeof item.userId === "object" ? item.userId : {};
          const id = entityId(participantUser) || entityId(item);
          const isSelf = user && String(user.id || user._id) === String(id);
          return (
            <li key={id || index} className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
              <div className="min-w-0">
                {participantUser.username ? (
                  <Link to={profilePath(participantUser.username)} className="truncate font-medium hover:text-primary">
                    {item.ffName || participantUser.ffName || participantUser.username || "Player"}
                  </Link>
                ) : (
                  <p className="truncate font-medium">{item.ffName || participantUser.ffName || participantUser.username || "Player"}</p>
                )}
                <p className="truncate text-xs text-textMuted">
                  @{participantUser.username || "player"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isAuthenticated && !isSelf ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-error"
                    onClick={() => setReportTarget(participantUser.id ? participantUser : { ...participantUser, _id: id })}
                  >
                    Report
                  </button>
                ) : null}
                <span className="text-xs text-textMuted">#{index + 1}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <ReportUserModal open={Boolean(reportTarget)} user={reportTarget} onClose={() => setReportTarget(null)} />
    </>
  );
}
