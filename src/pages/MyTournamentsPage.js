import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../components/common/Page";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import TournamentCard from "../components/Tournament/TournamentCard";
import useAuth from "../hooks/useAuth";
import tournamentApi from "../api/tournament.api";
import { extractList } from "../utils/errors";
import { TOURNAMENT_STATUSES } from "../utils/constants";
import { Trophy } from "lucide-react";

const TABS = [
  { id: "upcoming", label: "Upcoming", statuses: [TOURNAMENT_STATUSES.UPCOMING, TOURNAMENT_STATUSES.REGISTRATION_OPEN, TOURNAMENT_STATUSES.REGISTRATION_CLOSED] },
  { id: "live", label: "Live", statuses: [TOURNAMENT_STATUSES.LIVE] },
  { id: "completed", label: "Completed", statuses: [TOURNAMENT_STATUSES.COMPLETED, TOURNAMENT_STATUSES.CANCELLED] },
];

export default function MyTournamentsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await tournamentApi.list({ limit: 50 });
        const tournaments = extractList(response.data).items;
        const uid = user?.id || user?._id;
        const joined = [];
        await Promise.all(
          tournaments.map(async (tournament) => {
            try {
              const people = extractList((await tournamentApi.participants(tournament.id || tournament._id, { limit: 50 })).data).items;
              const isIn = people.some((item) => {
                const participantUser = item.userId;
                const id = typeof participantUser === "object" ? participantUser.id || participantUser._id : participantUser;
                return String(id) === String(uid);
              });
              if (isIn) joined.push(tournament);
            } catch {
              return null;
            }
          }),
        );
        if (active) setItems(joined);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const visible = useMemo(() => {
    const current = TABS.find((item) => item.id === tab);
    return items.filter((item) => current.statuses.includes(item.status));
  }, [items, tab]);

  return (
    <Page>
      <h1 className="text-2xl font-bold">My Tournaments</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto rounded-xl border border-border bg-surface p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === item.id ? "bg-primary text-textDark" : "text-textMuted"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((tournament) => (
              <TournamentCard key={tournament.id || tournament._id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="You haven't joined any tournaments yet."
            actionLabel="Find a cup"
            as={Link}
            to="/tournaments"
          />
        )}
      </div>
    </Page>
  );
}
