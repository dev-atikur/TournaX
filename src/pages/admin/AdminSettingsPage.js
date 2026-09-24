import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ErrorState from "../../components/common/ErrorState";
import adminApi from "../../api/admin.api";
import { extractEntity, getApiError } from "../../utils/errors";
import useStaff from "../../hooks/useStaff";

export default function AdminSettingsPage() {
  const staff = useStaff();
  const [form, setForm] = useState({
    supportEmail: "",
    announcement: "",
    maintenance: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setForm((prev) => ({ ...prev, ...extractEntity(res.data) })))
      .catch(() => {});
  }, []);

  if (!staff.canAccessSettings) {
    return <ErrorState title="Unauthorized" message="Settings are admin-only." />;
  }

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(getApiError(err, "Settings API is not available yet."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-textMuted">Platform controls. Backend authorization remains the source of truth.</p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Input
          label="Support email"
          value={form.supportEmail}
          onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))}
        />
        <label className="block text-sm font-medium text-textSecondary">
          Announcement
          <textarea
            rows={4}
            value={form.announcement}
            onChange={(e) => setForm((p) => ({ ...p, announcement: e.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.maintenance)}
            onChange={(e) => setForm((p) => ({ ...p, maintenance: e.target.checked }))}
          />
          Maintenance mode
        </label>
        <Button type="submit" loading={saving}>
          Save settings
        </Button>
      </form>
    </div>
  );
}
