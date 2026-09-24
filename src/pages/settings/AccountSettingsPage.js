import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import userApi from "../../api/user.api";
import authApi from "../../api/auth.api";
import { extractEntity, getApiError } from "../../utils/errors";

export default function AccountSettingsPage() {
  const { user, setUser, refreshUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getMe()
      .then((res) => {
        const me = extractEntity(res.data);
        setUser(me);
        setForm({
          fullName: me.fullName || "",
          username: me.username || "",
          email: me.email || "",
          phone: me.phone || "",
        });
      })
      .catch(() => {});
  }, [setUser]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateAccount({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
      });
      const me = extractEntity(res.data);
      if (me) setUser(me);
      else await refreshUser?.();
      toast.success("Account updated");
    } catch (err) {
      toast.error(getApiError(err, "Could not update account. Email or username changes may need verification."));
    } finally {
      setSaving(false);
    }
  };

  const resendEmail = async () => {
    try {
      await authApi.resendVerification({ email: form.email });
      toast.success("If this account exists, a verification email was sent.");
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const resendPhone = async () => {
    try {
      await authApi.resendPhoneVerification({ phone: form.phone });
      toast.success("If this number is on file, a verification code was sent.");
    } catch (err) {
      toast.error(getApiError(err, "Phone verification is not available yet."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-textMuted">Manage identity details used to sign in to Play With Fair.</p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Input label="Full name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
        <Input label="Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} hint="Public profile URL uses this username." />
        <div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={user?.isEmailVerified ? "verified" : "pending"}>
              {user?.isEmailVerified ? "Verified" : "Not verified"}
            </StatusBadge>
            {!user?.isEmailVerified ? (
              <>
                <Button type="button" size="sm" variant="secondary" onClick={resendEmail}>
                  Verify email
                </Button>
                <Link to="/verify-email" className="text-xs text-primary">
                  Enter OTP
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div>
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={user?.isPhoneVerified ? "verified" : "pending"}>
              {user?.isPhoneVerified ? "Verified" : "Not verified"}
            </StatusBadge>
            {!user?.isPhoneVerified ? (
              <Button type="button" size="sm" variant="secondary" onClick={resendPhone}>
                Verify phone
              </Button>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-textMuted">
          Sensitive changes are confirmed by the backend. PWF will not switch email or username without verification.
        </p>
        <Button type="submit" loading={saving}>
          Save account
        </Button>
      </form>
    </div>
  );
}
