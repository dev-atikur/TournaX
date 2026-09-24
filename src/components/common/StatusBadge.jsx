import Badge from "./Badge";
import { formatStatus } from "../../utils/format";

const toneMap = {
  upcoming: "primary",
  registration_open: "success",
  registration_closed: "warning",
  live: "error",
  completed: "default",
  cancelled: "error",
  draft: "info",
  scheduled: "primary",
  room_ready: "info",
  pending: "warning",
  in_review: "info",
  accepted: "success",
  resolved: "success",
  rejected: "error",
  verified: "success",
  active: "success",
  banned: "error",
  temporary: "warning",
  permanent: "error",
  user: "default",
  moderator: "info",
  admin: "primary",
};

export default function StatusBadge({ status, children }) {
  const key = String(status || "").toLowerCase();
  return (
    <Badge tone={toneMap[key] || "default"}>
      {key === "live" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-error" /> : null}
      {children || formatStatus(status)}
    </Badge>
  );
}
