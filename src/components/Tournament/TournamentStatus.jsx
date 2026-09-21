import Badge from "../common/Badge";
import { formatStatus } from "../../utils/format";

const statusTone = {
  upcoming: "primary",
  registration_open: "success",
  registration_closed: "warning",
  live: "error",
  completed: "default",
  cancelled: "error",
  draft: "info",
  scheduled: "primary",
  room_ready: "info",
};

export default function TournamentStatus({ status }) {
  const tone = statusTone[status] || "default";
  return (
    <Badge tone={tone}>
      {status === "live" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-error" /> : null}
      {formatStatus(status)}
    </Badge>
  );
}
