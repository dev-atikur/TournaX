import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import authApi from "../../api/auth.api";
import { getApiError } from "../../utils/errors";

export default function SecuritySettingsPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated. Other sessions may be signed out.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(getApiError(err, "Could not change password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Security</h1>
      <p className="mt-1 text-sm text-textMuted">Change your password. PWF never displays stored password values.</p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Input
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
          required
        />
        <Input
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          required
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/forgot-password" className="text-sm text-primary">
            Forgot password?
          </Link>
          <Button type="submit" loading={saving}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
}
