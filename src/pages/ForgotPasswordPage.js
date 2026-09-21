import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authApi from "../api/auth.api";
import { getApiError } from "../utils/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim(), method: "email" });
      toast.success("If this account exists, an OTP has been sent.");
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-10">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="text-sm text-textMuted">We will send a reset code to your email if the account exists.</p>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Send reset code</Button>
        <Link to="/reset-password" className="block text-center text-sm text-primary">I already have a code</Link>
      </form>
    </main>
  );
}
