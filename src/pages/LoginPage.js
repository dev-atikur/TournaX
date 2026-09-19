import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Mail, Lock, Eye, EyeOff, Trophy } from "lucide-react";

import api from "../api/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Input change করলে ওই input-এর error remove হবে
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Input change করলে general error remove হবে
    if (error) {
      setError("");
    }
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setErrors({
      email: "",
      password: "",
    });

    // =========================
    // Frontend Validation
    // =========================
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // =========================
      // Login API
      // =========================
      await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Login successful
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) { setError(message || "Please check your email and password.");}

      // =========================
      // Wrong Email / Password
      // =========================
      else if (status === 401) {
        setError(message || "Invalid email or password.");
      }

      // =========================
      // Other Error
      // =========================
      else {
        setError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Input Class
  // =========================
  const inputClass = (hasError = false) => `
    w-full rounded-xl border
    bg-surfaceHard
    py-3.5 pl-11 pr-4
    text-sm text-textPrimary
    outline-none transition
    placeholder:text-textMuted
    ${
      hasError
        ? "border-error focus:border-error focus:ring-2 focus:ring-error/10"
        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
    }
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <figure className="w-full max-w-md">
        {/* =========================
            Logo
        ========================= */}
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

        {/* =========================
            Login Card
        ========================= */}
        <div className="p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* =========================
                Email
            ========================= */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Email
              </label>

              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    errors.email ? "text-error" : "text-textMuted"
                  }`}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass(!!errors.email)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Email Error */}
              {errors.email && (
                <p className="mt-1.5 text-xs text-error">{errors.email}</p>
              )}
            </div>

            {/* =========================
                Password
            ========================= */}
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
                <Lock
                  className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    errors.password ? "text-error" : "text-textMuted"
                  }`}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass(!!errors.password)} pr-11`}
                  autoComplete="current-password"
                  required
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted transition hover:text-textPrimary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Error */}
              {errors.password && (
                <p className="mt-1.5 text-xs text-error">{errors.password}</p>
              )}
            </div>

            {/* =========================
                Remember Me
            ========================= */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer accent-primary"
              />

              <span className="text-sm text-textMuted">Remember me</span>
            </label>

            {/* =========================
                General Error
            ========================= */}
            {error && (
              <div className="rounded-xl border border-error/30 bg-errorSoft/20 px-3 py-2.5">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* =========================
                Login Button
            ========================= */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-textDark transition hover:bg-primaryHover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* =========================
              Divider
          ========================= */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-divider" />

            <span className="text-xs text-textDisabled">OR</span>

            <div className="h-px flex-1 bg-divider" />
          </div>

          {/* =========================
              Register
          ========================= */}
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

        <p className="mt-6 text-center text-xs text-textDisabled">
          © 2026 TournaX. All rights reserved.
        </p>
      </figure>
    </main>
  );
};

export default LoginPage;
