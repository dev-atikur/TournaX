import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarDays,
  ChevronDown,
  Trophy,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Register Data:", formData);

    // পরে এখানে API call করবে
    // await fetch("/api/auth/register", ...)

    navigate("/login");
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-textMuted">
            Join TournaX and start competing.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-7">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Username
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-textMuted">
                  @
                </span>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

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
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`${inputClass} pr-11`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted transition hover:text-textPrimary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`${inputClass} pr-11`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted transition hover:text-textPrimary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Date of Birth
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-textSecondary">
                Gender
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer appearance-none`}
                  required
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-primary"
              />

              <p className="text-xs leading-5 text-textMuted">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-primary hover:text-primarySoft"
                >
                  Terms & Conditions
                </button>{" "}
                and Privacy Policy.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-textDark transition hover:bg-primaryHover active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-divider pt-5 text-center">
            <p className="text-sm text-textMuted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary transition hover:text-primarySoft"
              >
                Login
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

export default RegisterPage;