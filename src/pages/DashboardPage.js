import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Crosshair, Trophy, Swords, Target } from "lucide-react";
import Page from "../components/common/Page";
import StatCard from "../components/Dashboard/StatCard";
import TournamentList from "../components/Dashboard/TournamentList";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import useAuth from "../hooks/useAuth";
import userApi from "../api/user.api";
import tournamentApi from "../api/tournament.api";
import { extractEntity, extractList } from "../utils/errors";
import { TOURNAMENT_STATUSES } from "../utils/constants";
import LeaderboardTable from "../components/Leaderboard/LeaderboardTable";
import leaderboardApi from "../api/leaderboard.api";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankRows, setRankRows] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [meRes, tournamentsRes, boardRes] = await Promise.all([
          userApi.getMe(),
          tournamentApi.list({ limit: 20, sort: "start", order: "asc" }),
          leaderboardApi.global({ limit: 5 }),
        ]);
        if (!active) return;
        const me = extractEntity(meRes.data);
        setProfile(me);
        setUser(me);
        const tournaments = extractList(tournamentsRes.data).items;
        const uid = me.id || me._id;
        const membership = [];
        await Promise.all(
          tournaments.slice(0, 12).map(async (tournament) => {
            try {
              const people = extractList((await tournamentApi.participants(tournament.id || tournament._id, { limit: 50 })).data).items;
              const isIn = people.some((item) => {
                const participantUser = item.userId;
                const id = typeof participantUser === "object" ? participantUser.id || participantUser._id : participantUser;
                return String(id) === String(uid);
              });
              if (isIn) membership.push(tournament);
            } catch {
              return null;
            }
          }),
        );
        setJoined(membership);
        setRankRows(extractList(boardRes.data).items);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [setUser]);

  if (loading) {
    return (
      <Page>
        <Spinner className="min-h-[40vh]" />
      </Page>
    );
  }

  const upcoming = joined.filter((item) =>
    [TOURNAMENT_STATUSES.UPCOMING, TOURNAMENT_STATUSES.REGISTRATION_OPEN, TOURNAMENT_STATUSES.REGISTRATION_CLOSED].includes(item.status),
  );
  const recent = joined.filter((item) => item.status === TOURNAMENT_STATUSES.COMPLETED).slice(0, 5);

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-textMuted">
            {profile?.fullName || profile?.username} · {profile?.ffName} · UID {profile?.ffUid}
          </p>
        </div>
        <Link to="/profile" className="text-sm font-semibold text-primary">
          Edit profile
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total matches" value={profile?.totalMatches} icon={Swords} />
        <StatCard label="Total wins" value={profile?.totalWins} icon={Trophy} />
        <StatCard label="Total points" value={profile?.totalPoints} icon={Target} />
        <StatCard label="Total kills" value={profile?.totalKills} icon={Crosshair} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <StatCard label="Tournaments played" value={profile?.tournamentsPlayed} />
        <StatCard label="Tournaments won" value={profile?.tournamentsWon} />
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Tournaments</h2>
          <Link to="/dashboard/tournaments" className="text-sm text-primary">View all</Link>
        </div>
        {joined.length ? (
          <TournamentList items={joined.slice(0, 5)} />
        ) : (
          <EmptyState title="You haven't joined any tournaments yet." actionLabel="Explore tournaments" as={Link} to="/tournaments" />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Upcoming Matches</h2>
        {upcoming.length ? (
          <TournamentList items={upcoming} />
        ) : (
          <EmptyState title="No upcoming matches" description="Join a tournament to see your next rooms here." />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Recent Results</h2>
        {recent.length ? <TournamentList items={recent} /> : <EmptyState title="No recent results" />}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leaderboard Position</h2>
          <Link to="/leaderboard" className="text-sm text-primary">Full board</Link>
        </div>
        {rankRows.length ? <LeaderboardTable rows={rankRows} highlightId={profile?.id || profile?._id} /> : <EmptyState title="No leaderboard results" />}
      </section>
    </Page>
  );
}
