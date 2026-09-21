import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";
import { getApiError } from "../utils/errors";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!formData.email.trim()) next.email = "Email is required.";
    if (!formData.password) next.password = "Password is required.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setLoading(true);
    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      if (result?.message?.toLowerCase().includes("otp")) {
        toast.success(result.message);
        navigate("/verify-email");
        return;
      }
      toast.success("Login successful");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      const message = getApiError(err, "Login failed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-textMuted">Login to continue to Play With Fair.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            placeholder="Enter your password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-textMuted hover:text-textPrimary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-textMuted">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="accent-primary"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary">
              Forgot password?
            </Link>
          </div>
          {error ? <p className="rounded-xl border border-error/30 bg-errorSoft/20 px-3 py-2 text-sm text-error">{error}</p> : null}
          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-textMuted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
