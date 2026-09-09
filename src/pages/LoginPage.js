import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trophy,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // পরে এখানে API call করবে
    // await fetch("/api/auth/login", ...)

    navigate("/dashboard");
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surfaceHard py-3.5 pl-11 pr-4 text-sm text-textPrimary outline-none transition placeholder:text-textMuted focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Trophy className="h-7 w-7 text-primary" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-textPrimary">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-textMuted">
            Login to continue to TournaX.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-7">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-textSecondary">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary transition hover:text-primarySoft"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-11`}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted transition hover:text-textPrimary"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer accent-primary"
              />

              <span className="text-sm text-textMuted">
                Remember me
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-textDark transition hover:bg-primaryHover active:scale-[0.99]"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-divider" />

            <span className="text-xs text-textDisabled">
              OR
            </span>

            <div className="h-px flex-1 bg-divider" />
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-sm text-textMuted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary transition hover:text-primarySoft"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-textDisabled">
          © 2026 TournaX. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;