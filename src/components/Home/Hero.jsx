import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import Button from "../common/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rotate-12 border border-primary/20" />
        <div className="absolute right-16 top-24 h-24 w-24 rounded-2xl border border-blue/20" />
      </div>
      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-16">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-primary">
            <Trophy className="h-3.5 w-3.5" />
            PWF · Free Fire Tournaments
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Play. Compete. <span className="text-primary">Win. Fair.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-textMuted sm:text-lg">
            Play With Fair is a professional Free Fire tournament platform. Discover events, register,
            join matches, track points, and climb a public leaderboard built on verified results.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/tournaments" size="lg">
              Explore Tournaments
            </Button>
            <Button as={Link} to="/register" variant="secondary" size="lg">
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
