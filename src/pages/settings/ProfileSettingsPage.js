import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import userApi from "../../api/user.api";
import { extractEntity, getApiError } from "../../utils/errors";
import { avatarUrl, displayName } from "../../utils/format";
import { profilePath } from "../../utils/profile";

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    ffName: user?.ffName || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || user?.avatar || "",
    instagram: "",
    telegram: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi.getMe().then((res) => {
      const me = extractEntity(res.data);
      setUser(me);
      setForm({
        fullName: me.fullName || "",
        ffName: me.ffName || "",
        bio: me.bio || "",
        profilePicture: me.profilePicture || me.avatar || "",
        instagram: me.socialLinks?.find((item) => item.platform === "instagram")?.url || "",
        telegram: me.socialLinks?.find((item) => item.platform === "telegram")?.url || "",
      });
    });
  }, [setUser]);

  const preview = {
    ...user,
    ...form,
    username: user?.username,
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const socialLinks = [];
      if (form.instagram) socialLinks.push({ platform: "instagram", url: form.instagram });
      if (form.telegram) socialLinks.push({ platform: "telegram", url: form.telegram });
      const res = await userApi.updateProfile({
        fullName: form.fullName,
        ffName: form.ffName,
        bio: form.bio,
        profilePicture: form.profilePicture,
        socialLinks,
      });
      const me = extractEntity(res.data);
      setUser(me);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiError(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="mt-1 text-sm text-textMuted">This is what other players see on your public page.</p>
        </div>
        {user?.username ? (
          <Link to={profilePath(user)} className="text-sm font-medium text-primary">
            View public profile
          </Link>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="mb-3 text-xs uppercase tracking-wide text-textMuted">Live preview</p>
          <img src={avatarUrl(preview)} alt="" className="mx-auto h-24 w-24 rounded-2xl object-cover" />
          <p className="mt-3 font-semibold">{displayName(preview)}</p>
          <p className="text-sm text-primary">@{user?.username}</p>
          <p className="mt-2 text-sm text-textSecondary">{form.ffName || "FF name not set"}</p>
          {form.bio ? <p className="mt-3 text-xs italic text-textMuted">“{form.bio}”</p> : null}
        </div>
        <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <Input label="Profile picture URL" value={form.profilePicture} onChange={(e) => setForm((p) => ({ ...p, profilePicture: e.target.value }))} />
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          <Input label="FF Name" value={form.ffName} onChange={(e) => setForm((p) => ({ ...p, ffName: e.target.value }))} />
          <label className="block text-sm font-medium text-textSecondary">
            Bio
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <Input label="Instagram" value={form.instagram} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))} />
          <Input label="Telegram" value={form.telegram} onChange={(e) => setForm((p) => ({ ...p, telegram: e.target.value }))} />
          <p className="text-xs text-textMuted">
            Role, points, wins, rank, and verification are official PWF values and cannot be edited here.
          </p>
          <Button type="submit" loading={saving}>
            Save profile
          </Button>
        </form>
      </div>
    </div>
  );
}
