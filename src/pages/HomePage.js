import React from "react";
import { Link } from "react-router-dom";
import Stat from "../components/Home/Stat";
import TournamentCard from "../components/common/TournamentCard";
import Step from "../components/Home/Step";

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-background text-textPrimary">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              FREE FIRE TOURNAMENTS
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Compete.
              <br />
              <span className="text-primary">Climb.</span>
              <br />
              Become a Champion.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-textMuted sm:text-lg">
              Join exciting Free Fire tournaments, compete with players, climb
              the leaderboard and prove your skills.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tournaments"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-textDark transition hover:bg-primaryHover"
              >
                Explore Tournaments
              </Link>

              <Link
                to="/matches"
                className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-textPrimary transition hover:bg-hover"
              >
                View Matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="border-y border-border bg-surfaceHard">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          <Stat value="1K+" label="Players" />
          <Stat value="100+" label="Tournaments" />
          <Stat value="50K+" label="Prize Pool" />
          <Stat value="24/7" label="Matches" />
        </div>
      </section>

      {/* ===== Featured Tournaments ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Compete Now
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Featured Tournaments
            </h2>

            <p className="mt-2 text-sm text-textMuted">
              Find a tournament and start competing.
            </p>
          </div>

          <Link
            to="/tournaments"
            className="hidden text-sm font-medium text-primary hover:text-primarySoft sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <TournamentCard
            title="Battle Royale"
            type="Squad"
            prize="৳10,000"
            players="32 / 48"
            status="LIVE"
          />

          <TournamentCard
            title="Clash Squad"
            type="Squad"
            prize="৳5,000"
            players="24 / 32"
            status="UPCOMING"
          />

          <TournamentCard
            title="Booyah Challenge"
            type="Solo"
            prize="৳2,500"
            players="46 / 50"
            status="UPCOMING"
          />
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="border-t border-border bg-backgroundSoft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Simple Process
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              How It Works
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Step
              number="01"
              title="Choose Tournament"
              description="Browse available tournaments and choose the one you want to play."
            />

            <Step
              number="02"
              title="Join & Play"
              description="Register your team or join a match and compete against other players."
            />

            <Step
              number="03"
              title="Win & Climb"
              description="Perform well, earn points and climb the leaderboard."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to enter the battle?
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm text-textMuted">
            Find your next tournament and show everyone what you can do.
          </p>

          <Link
            to="/tournaments"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-textDark transition hover:bg-primaryHover"
          >
            Join a Tournament
          </Link>
        </div>
      </section>
    </main>
  );
}