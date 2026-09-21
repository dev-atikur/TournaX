import { entityId } from "../../utils/format";

export default function ParticipantList({ participants = [] }) {
  if (!participants.length) {
    return <p className="text-sm text-textMuted">No participants yet.</p>;
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
      {participants.map((item, index) => {
        const user = item.userId && typeof item.userId === "object" ? item.userId : {};
        return (
          <li key={entityId(item) || index} className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{item.ffName || user.ffName || user.username || "Player"}</p>
              <p className="truncate text-xs text-textMuted">
                @{user.username || "player"} · UID {item.ffUid || user.ffUid || "—"}
              </p>
            </div>
            <span className="text-xs text-textMuted">#{index + 1}</span>
          </li>
        );
      })}
    </ul>
  );
}
