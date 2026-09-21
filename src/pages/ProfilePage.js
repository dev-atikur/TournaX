import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Page from "../components/common/Page";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import StatCard from "../components/Dashboard/StatCard";
import useAuth from "../hooks/useAuth";
import userApi from "../api/user.api";
import { extractEntity, getApiError } from "../utils/errors";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || user?.avatar || "",
    instagram: "",
    telegram: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getMe()
      .then((res) => {
        const me = extractEntity(res.data);
        setUser(me);
        const instagram = me.socialLinks?.find((item) => item.platform === "instagram")?.url || "";
        setForm({
          fullName: me.fullName || "",
          bio: me.bio || "",
          profilePicture: me.profilePicture || me.avatar || "",
          instagram,
          telegram: "",
        });
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const socialLinks = [];
      if (form.instagram) socialLinks.push({ platform: "instagram", url: form.instagram });
      const response = await userApi.updateProfile({
        fullName: form.fullName,
        bio: form.bio,
        profilePicture: form.profilePicture,
        socialLinks,
      });
      const me = extractEntity(response.data);
      setUser(me);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiError(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Page><p className="text-textMuted">Loading profile…</p></Page>;

  return (
    <Page width="max-w-4xl">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <img
            src={form.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "PWF")}`}
            alt=""
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p className="mt-3 font-semibold">{user?.fullName || user?.username}</p>
          <p className="text-sm text-textMuted">@{user?.username}</p>
        </div>
        <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          <Input label="Username" value={user?.username || ""} disabled />
          <Input label="FF Name" value={user?.ffName || ""} disabled />
          <Input label="FF UID" value={user?.ffUid || ""} disabled />
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Phone" value={user?.phone || "Not set"} disabled />
          <label className="block text-sm font-medium text-textSecondary">
            Bio
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <Input label="Profile picture URL" value={form.profilePicture} onChange={(e) => setForm((p) => ({ ...p, profilePicture: e.target.value }))} />
          <Input label="Instagram" value={form.instagram} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))} />
          <p className="text-xs text-textMuted">Role, verified status, points, wins, and official stats are managed by PWF staff.</p>
          <Button type="submit" loading={saving}>Save changes</Button>
        </form>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <StatCard label="Points" value={user?.totalPoints} />
        <StatCard label="Wins" value={user?.totalWins} />
        <StatCard label="Kills" value={user?.totalKills} />
        <StatCard label="Matches" value={user?.totalMatches} />
      </div>
    </Page>
  );
}
