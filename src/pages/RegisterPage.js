import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Trophy, User } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authApi from "../api/auth.api";
import { getApiError } from "../utils/errors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    ffName: "",
    ffUid: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required.";
    if (!formData.username.trim()) next.username = "Username is required.";
    if (!formData.email.trim()) next.email = "Email is required.";
    if (!formData.ffName.trim() || formData.ffName.trim().length < 3) next.ffName = "Free Fire name is required.";
    if (!formData.ffUid.trim() || formData.ffUid.trim().length < 3) next.ffUid = "Free Fire UID is required.";
    if (!formData.password) next.password = "Password is required.";
    else if (formData.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        ffName: formData.ffName.trim(),
        ffUid: formData.ffUid.trim(),
        password: formData.password,
      });
      toast.success("Registration successful. Verify your email.");
      navigate("/verify-email", { state: { email: formData.email.trim() } });
    } catch (err) {
      const message = getApiError(err, "Registration failed");
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
          <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-textMuted">Join Play With Fair and start competing.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} leftIcon={<User className="h-4 w-4" />} placeholder="Your name" autoComplete="name" />
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} placeholder="Choose a username" autoComplete="username" />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} leftIcon={<Mail className="h-4 w-4" />} placeholder="Email" autoComplete="email" />
          <Input label="Free Fire Name" name="ffName" value={formData.ffName} onChange={handleChange} error={errors.ffName} placeholder="In-game name" />
          <Input label="Free Fire UID" name="ffUid" value={formData.ffUid} onChange={handleChange} error={errors.ffUid} placeholder="UID" />
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            rightSlot={
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password" className="text-textMuted">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            rightSlot={
              <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} aria-label="Toggle confirm password" className="text-textMuted">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {error ? <p className="rounded-xl border border-error/30 bg-errorSoft/20 px-3 py-2 text-sm text-error">{error}</p> : null}
          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-textMuted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
