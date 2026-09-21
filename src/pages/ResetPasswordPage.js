import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authApi from "../api/auth.api";
import { getApiError } from "../utils/errors";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setLoading(true);
    try {
      await authApi.resetPassword({ password });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-10">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-textMuted">Enter a new password after verifying the reset code from email.</p>
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Update password</Button>
      </form>
    </main>
  );
}
