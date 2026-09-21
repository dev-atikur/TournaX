import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authApi from "../api/auth.api";
import { getApiError } from "../utils/errors";
import useAuth from "../hooks/useAuth";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    try {
      await authApi.verifyEmail({ otp: otp.trim() });
      await refreshUser();
      toast.success("Email verified");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getApiError(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await authApi.resendVerification({ email });
      toast.success("If this account exists, an OTP has been sent.");
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-10">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Verify email</h1>
        <p className="text-sm text-textMuted">Enter the OTP sent to your email to activate your PWF account.</p>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Verify</Button>
        <button type="button" onClick={resend} className="w-full text-sm text-primary">
          Resend code
        </button>
      </form>
    </main>
  );
}
