import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Swords, Trophy } from "lucide-react";
import Hero from "../components/Home/Hero";
import Stat from "../components/Home/Stat";
import Step from "../components/Home/Step";
import Footer from "../components/layouts/Footer";
import TournamentCard from "../components/Tournament/TournamentCard";
import { SkeletonCard } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import tournamentApi from "../api/tournament.api";
import { extractList } from "../utils/errors";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [openRes, liveRes] = await Promise.all([
          tournamentApi.list({ status: "registration_open", limit: 6, sort: "start", order: "asc" }),
          tournamentApi.list({ status: "upcoming", limit: 6, sort: "start", order: "asc" }),
        ]);
        if (!active) return;
        const open = extractList(openRes.data).items;
        const soon = extractList(liveRes.data).items;
        setFeatured(open.length ? open : soon);
        setUpcoming(soon);
      } catch {
        if (active) {
          setFeatured([]);
          setUpcoming([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background text-textPrimary">
      <Hero />

      <section className="border-y border-border bg-surfaceHard">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Stat value="1K+" label="Players" />
          <Stat value="30+" label="Tournaments" />
          <Stat value="100%" label="Fair Play" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Compete now</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Featured Tournaments</h2>
            <p className="mt-2 text-sm text-textMuted">Find a room, register, and compete with verified scoring.</p>
          </div>
          <Link to="/tournaments" className="hidden text-sm font-medium text-primary sm:block">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : featured.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((tournament) => (
              <TournamentCard key={tournament.id || tournament._id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="No featured tournaments"
            description="New Free Fire cups will appear here as soon as registration opens."
            actionLabel="Browse tournaments"
            as={Link}
            to="/tournaments"
          />
        )}
      </section>

      <section className="border-t border-border bg-backgroundSoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Schedule</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Upcoming Matches</h2>
          </div>
          {upcoming.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.slice(0, 3).map((tournament) => (
                <TournamentCard key={tournament.id || tournament._id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Swords}
              title="No upcoming matches"
              description="Check tournaments to see when rooms go live."
              actionLabel="View matches"
              as={Link}
              to="/matches"
            />
          )}
        </div>
      </section>

      <section className="border-t border-border bg-backgroundSoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple process</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">How It Works</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Step number="01" title="Create your PWF profile" description="Register with your Free Fire name and UID so results can be verified fairly." />
            <Step number="02" title="Join a tournament" description="Pick a mode, pay the entry if required, and lock your slot before the deadline." />
            <Step number="03" title="Play and climb" description="Join the room on time, finish matches, and earn points on the public leaderboard." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Fair play first", text: "Verified results, staff-controlled rooms, and public scoring rules." },
            { icon: Trophy, title: "Competitive structure", text: "Solo, Duo, Lone Wolf, and Clash Squad formats with clear prize pools." },
            { icon: Swords, title: "Built for Free Fire", text: "Maps, modes, and match flow designed around how FF cups actually run." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-textMuted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to compete on PWF?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-textMuted">
            Join Play With Fair, register for a cup, and prove your rank with clean, verified results.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-textDark hover:bg-primaryHover"
          >
            Join Now
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
