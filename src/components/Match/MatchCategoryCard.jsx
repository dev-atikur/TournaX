import { Link } from "react-router-dom";
import { Crosshair, Gamepad2, Shield, Swords, Users, Zap } from "lucide-react";

const ICONS = {
  crosshair: Crosshair,
  users: Users,
  shield: Shield,
  swords: Swords,
  zap: Zap,
  gamepad: Gamepad2,
};

export default function MatchCategoryCard({ item, count = 0 }) {
  const Icon = ICONS[item.icon] || Swords;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-primary/40">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-surfaceElevated to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.18),transparent_55%)]" />
        <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full border border-primary/20" />
        <div className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full border border-primary/10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-primary">{item.gameMode}</p>
        <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
        <p className="mt-2 text-sm text-textMuted">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-textSecondary">
            {count > 0 ? `${count} tournaments` : "No open rooms"}
          </span>
          <Link
            to={`/matches/modes/${item.slug}`}
            className="text-sm font-semibold text-primary hover:text-primarySoft"
          >
            View matches
          </Link>
        </div>
      </div>
    </article>
  );
}
