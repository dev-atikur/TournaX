import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserRound,
  UserCog,
} from "lucide-react";
import { clsx } from "clsx";

const LINKS = [
  { to: "/settings/account", label: "Account", icon: UserCog },
  { to: "/settings/profile", label: "Profile", icon: UserRound },
  { to: "/settings/security", label: "Security", icon: Lock },
  { to: "/settings/2fa", label: "Two-Factor Authentication", icon: ShieldCheck },
  { to: "/settings/sessions", label: "Sessions", icon: Smartphone },
  { to: "/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/settings/privacy", label: "Privacy", icon: KeyRound },
  { to: "/settings/danger", label: "Danger Zone", icon: ShieldAlert, danger: true },
];

export default function SettingsLayout() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surfaceHard lg:flex lg:flex-col">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-extrabold tracking-wide">Settings</p>
          <p className="text-[11px] uppercase tracking-wider text-textMuted">Play With Fair</p>
        </div>
        <SettingsNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-surfaceHard px-4 py-3 lg:hidden">
          <p className="mb-2 text-sm font-semibold">Settings</p>
          <SettingsNav horizontal />
        </div>
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsNav({ horizontal = false }) {
  return (
    <nav
      className={clsx(horizontal ? "flex gap-1 overflow-x-auto pb-1" : "flex flex-1 flex-col gap-1 p-3")}
      aria-label="Settings"
    >
      {LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition whitespace-nowrap",
              isActive
                ? item.danger
                  ? "bg-error/15 text-error"
                  : "bg-primary/15 text-primary"
                : item.danger
                  ? "text-error/80 hover:bg-error/10"
                  : "text-textSecondary hover:bg-hover hover:text-textPrimary",
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
