import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import authApi from "../../api/auth.api";
import userApi from "../../api/user.api";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../utils/errors";

export default function DangerSettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [action, setAction] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      if (action === "delete" && confirmText !== "DELETE") {
        toast.error("Type DELETE to confirm.");
        return;
      }
      if (action === "logout-all") {
        await authApi.logoutAllSessions();
        toast.success("All sessions signed out");
        await logout();
        navigate("/login");
      } else if (action === "deactivate") {
        await userApi.deactivateAccount({ confirm: true });
        toast.success("Account deactivation requested");
        await logout();
        navigate("/");
      } else if (action === "delete") {
        await userApi.deleteAccount({ confirm: "DELETE" });
        toast.success("Account deletion requested");
        await logout();
        navigate("/");
      }
      setAction("");
      setConfirmText("");
    } catch (err) {
      toast.error(getApiError(err, "The backend rejected this action."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-error">Danger Zone</h1>
      <p className="mt-1 text-sm text-textMuted">These actions are sent to the API. Nothing is deleted only in the browser.</p>
      <div className="mt-6 space-y-3">
        <DangerRow
          title="Logout all devices"
          description="End every active PWF session, including this one."
          action="Sign out all"
          onClick={() => setAction("logout-all")}
        />
        <DangerRow
          title="Deactivate account"
          description="Temporarily disable login until staff or you restore the account."
          action="Deactivate"
          onClick={() => setAction("deactivate")}
        />
        <DangerRow
          title="Delete account"
          description="Permanently request removal of this player account."
          action="Delete account"
          onClick={() => setAction("delete")}
        />
      </div>
      <ConfirmDialog
        open={Boolean(action)}
        title={
          action === "delete"
            ? "Delete this account?"
            : action === "deactivate"
              ? "Deactivate this account?"
              : "Logout all devices?"
        }
        confirmLabel={action === "delete" ? "Delete account" : "Confirm"}
        loading={busy}
        onClose={() => {
          setAction("");
          setConfirmText("");
        }}
        onConfirm={run}
      >
        {action === "delete" ? (
          <div className="space-y-3">
            <p className="text-sm text-textSecondary">
              Type <strong>DELETE</strong> to confirm. This calls the backend delete endpoint.
            </p>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
            {confirmText !== "DELETE" ? (
              <p className="text-xs text-error">Confirmation text must match DELETE before the request is accepted.</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-textSecondary">This cannot be undone from the settings screen alone.</p>
        )}
      </ConfirmDialog>
    </div>
  );
}

function DangerRow({ title, description, action, onClick }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-error/30 bg-errorSoft/10 px-4 py-4">
      <div>
        <p className="font-semibold text-textPrimary">{title}</p>
        <p className="text-sm text-textMuted">{description}</p>
      </div>
      <Button variant="danger" size="sm" onClick={onClick}>
        {action}
      </Button>
    </div>
  );
}
