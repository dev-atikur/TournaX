import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Switch from "../../components/common/Switch";
import Button from "../../components/common/Button";
import userApi from "../../api/user.api";
import { extractEntity, getApiError } from "../../utils/errors";

const DEFAULTS = {
  tournaments: true,
  matches: true,
  results: true,
  security: true,
  email: true,
};

export default function NotificationsSettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getNotificationSettings()
      .then((res) => setForm((prev) => ({ ...prev, ...extractEntity(res.data) })))
      .catch(() => {});
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await userApi.updateNotificationSettings(form);
      toast.success("Notification preferences saved");
    } catch (err) {
      toast.error(getApiError(err, "Could not save notification settings."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Notifications</h1>
      <p className="mt-1 text-sm text-textMuted">Choose which PWF alerts you want. Preferences are stored by the backend.</p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Switch
          label="Tournament notifications"
          description="Registration, start times, and cup updates."
          checked={form.tournaments}
          onChange={(value) => setForm((p) => ({ ...p, tournaments: value }))}
        />
        <Switch
          label="Match notifications"
          description="Room ready and live match alerts."
          checked={form.matches}
          onChange={(value) => setForm((p) => ({ ...p, matches: value }))}
        />
        <Switch
          label="Result notifications"
          description="Verified placements and leaderboard changes."
          checked={form.results}
          onChange={(value) => setForm((p) => ({ ...p, results: value }))}
        />
        <Switch
          label="Security notifications"
          description="Password, 2FA, and new device alerts."
          checked={form.security}
          onChange={(value) => setForm((p) => ({ ...p, security: value }))}
        />
        <Switch
          label="Email notifications"
          description="Send copies of important alerts to your email."
          checked={form.email}
          onChange={(value) => setForm((p) => ({ ...p, email: value }))}
        />
        <Button type="submit" loading={saving}>
          Save preferences
        </Button>
      </form>
    </div>
  );
}
