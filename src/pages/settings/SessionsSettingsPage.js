import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Monitor } from "lucide-react";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import authApi from "../../api/auth.api";
import { extractList, getApiError } from "../../utils/errors";
import { entityId, timeAgo } from "../../utils/format";

export default function SessionsSettingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = extractList((await authApi.getSessions()).data);
      setItems(result.items);
    } catch (err) {
      setError(getApiError(err, "Could not load sessions."));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logoutOne = async () => {
    setBusy(true);
    try {
      await authApi.logoutSession(entityId(pending));
      toast.success("Session signed out");
      setPending(null);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const logoutOthers = async () => {
    setBusy(true);
    try {
      await authApi.logoutOtherSessions();
      toast.success("Other devices signed out");
      load();
    } catch (err) {
      toast.error(getApiError(err, "Could not sign out other sessions."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="mt-1 text-sm text-textMuted">Active devices using your PWF account. Session tokens are never shown.</p>
        </div>
        <Button variant="secondary" onClick={logoutOthers} loading={busy}>
          Logout all other devices
        </Button>
      </div>
      <div className="mt-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : items.length ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={entityId(item)} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.browser || item.userAgent || "Browser"}
                      {item.os ? ` · ${item.os}` : ""}
                    </p>
                    <p className="text-xs text-textMuted">
                      {item.location || item.country || "Unknown location"} · Last active {timeAgo(item.lastActiveAt || item.updatedAt)}
                      {item.current ? " · This device" : ""}
                    </p>
                  </div>
                </div>
                {!item.current ? (
                  <Button size="sm" variant="danger" onClick={() => setPending(item)}>
                    Logout
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Monitor} title="No session list available" description="The sessions API did not return any devices." />
        )}
      </div>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Sign out this device?"
        confirmLabel="Logout"
        loading={busy}
        onClose={() => setPending(null)}
        onConfirm={logoutOne}
      >
        <p className="text-sm text-textSecondary">This device will need to log in again.</p>
      </ConfirmDialog>
    </div>
  );
}
