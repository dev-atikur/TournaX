import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Switch from "../../components/common/Switch";
import Button from "../../components/common/Button";
import userApi from "../../api/user.api";
import { extractEntity, getApiError } from "../../utils/errors";

const DEFAULTS = {
  publicProfile: true,
  showStats: true,
  showTournamentHistory: true,
  showSocialLinks: true,
};

export default function PrivacySettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getPrivacySettings()
      .then((res) => setForm((prev) => ({ ...prev, ...extractEntity(res.data) })))
      .catch(() => {});
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await userApi.updatePrivacySettings(form);
      toast.success("Privacy settings saved");
    } catch (err) {
      toast.error(getApiError(err, "Privacy settings are only applied if the backend supports them."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Privacy</h1>
      <p className="mt-1 text-sm text-textMuted">
        These controls are sent to the API. They are not enforced in the browser alone.
      </p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Switch
          label="Show profile publicly"
          description="Allow /profile/username to load your player card."
          checked={form.publicProfile}
          onChange={(value) => setForm((p) => ({ ...p, publicProfile: value }))}
        />
        <Switch
          label="Show match statistics"
          description="Matches, wins, kills, and points on your public profile."
          checked={form.showStats}
          onChange={(value) => setForm((p) => ({ ...p, showStats: value }))}
        />
        <Switch
          label="Show tournament history"
          description="Recent cups on your public profile."
          checked={form.showTournamentHistory}
          onChange={(value) => setForm((p) => ({ ...p, showTournamentHistory: value }))}
        />
        <Switch
          label="Show social links"
          description="Instagram, Telegram, and other public links."
          checked={form.showSocialLinks}
          onChange={(value) => setForm((p) => ({ ...p, showSocialLinks: value }))}
        />
        <Button type="submit" loading={saving}>
          Save privacy
        </Button>
      </form>
    </div>
  );
}
