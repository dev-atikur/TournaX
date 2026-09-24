import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import ConfirmDialog from "../common/ConfirmDialog";
import reportApi from "../../api/report.api";
import { REPORT_STATUSES } from "../../utils/constants";
import { displayName, entityId, formatDateTime } from "../../utils/format";
import { getApiError } from "../../utils/errors";
import useStaff from "../../hooks/useStaff";

export default function ReportDetailsModal({ open, report, onClose, onBan, onChanged }) {
  const staff = useStaff();
  const [notes, setNotes] = useState(report?.staffNotes || report?.notes || "");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const update = async (status) => {
    setLoading(true);
    try {
      await reportApi.update(entityId(report), { status, notes });
      toast.success(`Report ${status.replace("_", " ")}`);
      setConfirm("");
      onChanged?.();
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not update report"));
    } finally {
      setLoading(false);
    }
  };

  if (!report) return null;
  const reporter = report.reporter || report.reporterId || {};
  const reported = report.reportedUser || report.reportedUserId || {};

  return (
    <>
      <Modal
        open={open}
        title="Report details"
        size="lg"
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => update(REPORT_STATUSES.IN_REVIEW)} loading={loading}>
              Mark in review
            </Button>
            <Button onClick={() => update(REPORT_STATUSES.RESOLVED)} loading={loading}>
              Resolve
            </Button>
            <Button variant="danger" onClick={() => setConfirm("reject")}>
              Reject
            </Button>
            {staff.canBanUsers ? (
              <Button variant="danger" onClick={onBan}>
                Ban user
              </Button>
            ) : null}
          </>
        }
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <Item label="Report ID" value={entityId(report)} />
          <Item label="Status" value={<StatusBadge status={report.status} />} />
          <Item label="Type" value={report.type || report.reason} />
          <Item label="Created" value={formatDateTime(report.createdAt)} />
          <Item label="Reporter" value={displayName(reporter) || reporter.username || "—"} />
          <Item label="Reported user" value={displayName(reported) || reported.username || "—"} />
          <Item label="Assigned" value={displayName(report.assignedTo) || "Unassigned"} />
          <Item label="Match ID" value={report.matchId || "—"} />
        </dl>
        <div className="mt-4 rounded-xl border border-border bg-surfaceSoft p-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-textMuted">Description</p>
          <p className="mt-1 text-textSecondary">{report.description || report.reason || "No details provided."}</p>
        </div>
        {report.evidence ? (
          <div className="mt-3 rounded-xl border border-border bg-surfaceSoft p-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-textMuted">Evidence</p>
            <a href={report.evidence} className="mt-1 block break-all text-primary" target="_blank" rel="noreferrer">
              {report.evidence}
            </a>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {entityId(reported) ? (
            <Link className="text-primary" to={`${staff.basePath}/users?user=${entityId(reported)}`}>
              View user
            </Link>
          ) : null}
          {report.matchId ? (
            <Link className="text-primary" to={`${staff.basePath}/matches?match=${report.matchId}`}>
              View match
            </Link>
          ) : null}
        </div>
        <label className="mt-4 block text-sm font-medium text-textSecondary">
          Staff notes
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </Modal>
      <ConfirmDialog
        open={confirm === "reject"}
        title="Reject this report?"
        confirmLabel="Reject"
        loading={loading}
        onClose={() => setConfirm("")}
        onConfirm={() => update(REPORT_STATUSES.REJECTED)}
      >
        <p className="text-sm text-textSecondary">Rejected reports stay in the archive for audit.</p>
      </ConfirmDialog>
    </>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-textMuted">{label}</dt>
      <dd className="mt-0.5 text-textPrimary">{value}</dd>
    </div>
  );
}
