import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Flag, Medal, Swords, Trophy } from "lucide-react";
import { FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import Page from "../components/common/Page";
import StatCard from "../components/Dashboard/StatCard";
import Button from "../components/common/Button";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ReportUserModal from "../components/admin/ReportUserModal";
import userApi from "../api/user.api";
import leaderboardApi from "../api/leaderboard.api";
import useAuth from "../hooks/useAuth";
import { extractEntity, extractList, getApiError } from "../utils/errors";
import { avatarUrl, displayName, formatDate, formatDateTime } from "../utils/format";
import { socialList, toPublicProfile } from "../utils/profile";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  telegram: FaTelegramPlane,
  youtube: FaYoutube,
};

export default function PublicProfilePage() {
  const { username } = useParams();
  const { user: me, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await userApi.getPublicProfile(username);
        if (!active) return;
        const publicUser = toPublicProfile(extractEntity(res.data));
        setProfile(publicUser);
        const listedRank = publicUser?.rank || publicUser?.leaderboardRank;
        if (listedRank) {
          setRank(listedRank);
        } else {
          try {
            const board = extractList((await leaderboardApi.global({ search: username, limit: 20 })).data).items;
            const row = board.find((item) => item.username?.toLowerCase() === username.toLowerCase());
            if (active) setRank(row?.rank || null);
          } catch {
            if (active) setRank(null);
          }
        }
      } catch (err) {
        if (active) {
          setProfile(null);
          setError(getApiError(err, "Player not found."));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [username]);

  if (loading) {
    return (
      <Page>
        <LoadingState label="Loading player profile" />
      </Page>
    );
  }

  if (error || !profile) {
    return (
      <Page>
        <ErrorState title="Profile not found" message={error} />
      </Page>
    );
  }

  const isOwner = me?.username && me.username.toLowerCase() === profile.username?.toLowerCase();
  const links = socialList(profile);

  return (
    <Page width="max-w-5xl">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="h-28 bg-[radial-gradient(circle_at_20%_20%,rgba(255,184,0,0.28),transparent_45%),linear-gradient(180deg,#11131a,#0a0b10)]" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <img
                src={avatarUrl(profile)}
                alt=""
                className="h-24 w-24 rounded-2xl border-4 border-surface object-cover shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold">{displayName(profile)}</h1>
                <p className="text-sm text-primary">@{profile.username}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isOwner ? (
                <>
                  <Button as={Link} to="/settings/profile" variant="secondary" size="sm">
                    Edit profile
                  </Button>
                  <Button as={Link} to="/settings" size="sm">
                    Settings
                  </Button>
                </>
              ) : isAuthenticated ? (
                <Button variant="danger" size="sm" onClick={() => setReportOpen(true)}>
                  <Flag className="h-4 w-4" />
                  Report User
                </Button>
              ) : null}
            </div>
          </div>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info label="FF Name" value={profile.ffName || "—"} />
            <Info label="Joined" value={formatDate(profile.createdAt)} />
            <Info
              label="Leaderboard"
              value={rank ? `#${rank}` : "Unranked"}
            />
          </dl>
          {profile.bio ? <p className="mt-4 max-w-2xl text-sm italic text-textSecondary">“{profile.bio}”</p> : null}
          {links.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {links.map((item) => {
                const Icon = SOCIAL_ICONS[item.platform] || Trophy;
                return (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-textSecondary hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.platform}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Matches" value={profile.totalMatches} icon={Swords} />
        <StatCard label="Wins" value={profile.totalWins} icon={Trophy} />
        <StatCard label="Kills" value={profile.totalKills} />
        <StatCard label="Points" value={profile.totalPoints} icon={Medal} />
        <StatCard label="Cups played" value={profile.tournamentsPlayed} />
        <StatCard label="Cups won" value={profile.tournamentsWon} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <HistoryCard
          title="Recent tournaments"
          empty="No tournament history."
          items={profile.recentTournaments}
          render={(item) => item.title || item.name}
        />
        <HistoryCard
          title="Recent matches"
          empty="No recent matches."
          items={profile.recentMatches}
          render={(item) => item.title || `Match #${item.matchNumber || ""}`}
        />
        <HistoryCard
          title="Recent results"
          empty="No published results."
          items={profile.recentResults}
          render={(item) =>
            `${item.placement ? `#${item.placement}` : "Result"} · ${item.kills ?? 0} kills`
          }
        />
      </div>
      <ReportUserModal open={reportOpen} user={profile} onClose={() => setReportOpen(false)} />
    </Page>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surfaceHard px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-textMuted">{label}</dt>
      <dd className="mt-0.5 font-medium text-textPrimary">{value}</dd>
    </div>
  );
}

function HistoryCard({ title, items = [], empty, render }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {items?.length ? (
        <ul className="mt-3 space-y-2 text-sm">
          {items.slice(0, 6).map((item, index) => (
            <li key={item.id || item._id || index} className="flex items-center justify-between gap-2 text-textSecondary">
              <span className="truncate">{render(item)}</span>
              {item.createdAt || item.scheduledAt ? (
                <span className="shrink-0 text-xs text-textMuted">
                  {formatDateTime(item.createdAt || item.scheduledAt)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-textMuted">{empty}</p>
      )}
    </section>
  );
}
