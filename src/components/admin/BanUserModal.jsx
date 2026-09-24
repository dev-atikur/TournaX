import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import adminApi from "../../api/admin.api";
import { BAN_DURATION_PRESETS, BAN_REASONS, BAN_TYPES } from "../../utils/constants";
import { getApiError } from "../../utils/errors";
import { displayName as nameOf, entityId, getBanInfo } from "../../utils/format";

function emptyForm(user) {
  const ban = getBanInfo(user);
  return {
    type: ban.type || BAN_TYPES.TEMPORARY,
    reason: BAN_REASONS.includes(ban.reason) ? ban.reason : ban.reason ? "Other" : "Cheating",
    customReason: BAN_REASONS.includes(ban.reason) ? "" : ban.reason || "",
    hours: 168,
    notes: ban.notes || "",
  };
}

export default function BanUserModal({ open, user, mode = "ban", onClose, onDone }) {
  const [form, setForm] = useState(() => emptyForm(user));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm(emptyForm(user));
  }, [open, user]);

  const title = mode === "extend" ? "Extend Ban" : mode === "change" ? "Change Ban" : "Ban User";
  const reason = form.reason === "Other" ? form.customReason.trim() : form.reason;
  const expiresAt = useMemo(() => {
    if (form.type !== BAN_TYPES.TEMPORARY) return null;
    return new Date(Date.now() + Number(form.hours) * 3600000).toISOString();
  }, [form.type, form.hours]);

  const submit = async () => {
    if (!reason) {
      toast.error("Provide a ban reason");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        reason,
        notes: form.notes,
        durationHours: form.type === BAN_TYPES.TEMPORARY ? Number(form.hours) : null,
        expiresAt,
      };
      const id = entityId(user);
      if (mode === "extend") await adminApi.extendBan(id, payload);
      else await adminApi.banUser(id, payload);
      toast.success(mode === "extend" ? "Ban extended" : "User banned");
      setConfirmOpen(false);
      onDone?.();
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not update ban"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Modal
        open={open}
        title={title}
        description={`Apply a fair-play restriction to ${nameOf(user)}.`}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              {title}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select
            label="Ban type"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value={BAN_TYPES.TEMPORARY}>Temporary</option>
            <option value={BAN_TYPES.PERMANENT}>Permanent</option>
          </Select>
          <Select
            label="Reason"
            value={form.reason}
            onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
          >
            {BAN_REASONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          {form.reason === "Other" ? (
            <Input
              label="Custom reason"
              value={form.customReason}
              onChange={(e) => setForm((prev) => ({ ...prev, customReason: e.target.value }))}
              required
            />
          ) : null}
          {form.type === BAN_TYPES.TEMPORARY ? (
            <>
              <Select
                label="Duration"
                value={form.hours}
                onChange={(e) => setForm((prev) => ({ ...prev, hours: e.target.value }))}
              >
                {BAN_DURATION_PRESETS.map((item) => (
                  <option key={item.hours} value={item.hours}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Input label="Expiration date" value={expiresAt ? new Date(expiresAt).toLocaleString() : ""} disabled />
            </>
          ) : (
            <p className="rounded-xl border border-error/30 bg-errorSoft/20 px-3 py-2 text-sm text-error">
              Permanent bans have no expiration date.
            </p>
          )}
          <label className="block text-sm font-medium text-textSecondary">
            Admin notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>
      </Modal>
      <ConfirmDialog
        open={confirmOpen}
        title={`Ban ${nameOf(user)}?`}
        confirmLabel="Ban user"
        loading={loading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submit}
      >
        <p className="text-sm text-textSecondary">
          Type: <strong className="capitalize text-textPrimary">{form.type}</strong>
          <br />
          Reason: <strong className="text-textPrimary">{reason || "—"}</strong>
          {form.type === BAN_TYPES.TEMPORARY ? (
            <>
              <br />
              Expires: <strong className="text-textPrimary">{expiresAt ? new Date(expiresAt).toLocaleString() : "—"}</strong>
            </>
          ) : (
            <>
              <br />
              This restriction does not expire.
            </>
          )}
        </p>
      </ConfirmDialog>
    </>
  );
}
