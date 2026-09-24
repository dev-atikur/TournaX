import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Flag,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Swords,
  Trophy,
  Users,
  ClipboardCheck,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import useStaff from "../../hooks/useStaff";
import reportApi from "../../api/report.api";
import { extractList } from "../../utils/errors";
import { avatarUrl, displayName } from "../../utils/format";

const StaffUiContext = createContext({ pendingReports: 0 });
export const useStaffUi = () => useContext(StaffUiContext);

export default function AdminLayout() {
  const { user } = useAuth();
  const staff = useStaff();
  const { pathname } = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    reportApi
      .pending()
      .then((res) => {
        if (!active) return;
        const { pagination, items } = extractList(res.data);
        setPendingReports(pagination?.total || items.filter((item) => item.status === "pending").length || 0);
      })
      .catch(() => {
        if (active) setPendingReports(0);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const links = useMemo(() => {
    const base = staff.basePath;
    const items = [
      { to: base, label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: `${base}/tournaments`, label: "Tournaments", icon: Trophy },
      { to: `${base}/matches`, label: "Matches", icon: Swords },
    ];
    if (staff.canViewUsers) items.push({ to: `${base}/users`, label: "Users", icon: Users });
    items.push({ to: `${base}/results`, label: "Results", icon: ClipboardCheck });
    if (staff.canReviewReports) items.push({ to: `${base}/reports`, label: "Reports", icon: Flag, badge: pendingReports });
    if (staff.canAccessSettings) items.push({ to: `${base}/settings`, label: "Settings", icon: Settings });
    return items;
  }, [staff, pendingReports]);

  return (
    <StaffUiContext.Provider value={{ pendingReports }}>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-background">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surfaceHard lg:flex lg:flex-col">
          <Brand staff={staff} />
          <SidebarNav links={links} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surfaceHard px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg p-2 text-textSecondary hover:bg-hover lg:hidden"
                onClick={() => setDrawer(true)}
                aria-label="Open staff menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <p className="text-sm font-semibold">{staff.isAdmin ? "Admin console" : "Moderator console"}</p>
            </div>
            <div className="flex items-center gap-2">
              <NavLink to="/notifications" className="rounded-lg p-2 text-textSecondary hover:bg-hover" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </NavLink>
              <NavLink to="/" className="hidden text-xs text-textMuted hover:text-primary sm:inline">
                View site
              </NavLink>
              <div className="flex items-center gap-2 rounded-xl border border-border px-2 py-1">
                <img src={avatarUrl(user)} alt="" className="h-7 w-7 rounded-full object-cover" />
                <span className="hidden text-xs sm:block">
                  <span className="block font-medium">{displayName(user)}</span>
                  <span className="capitalize text-textMuted">{user?.role}</span>
                </span>
              </div>
            </div>
          </div>
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>

        <AnimatePresence>
          {drawer ? (
            <>
              <motion.button
                type="button"
                className="fixed inset-0 z-40 bg-overlay/70 lg:hidden"
                aria-label="Close staff menu"
                onClick={() => setDrawer(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surfaceHard lg:hidden"
              >
                <div className="flex items-center justify-between px-4 py-4">
                  <Brand staff={staff} />
                  <button type="button" className="rounded-lg p-2 hover:bg-hover" onClick={() => setDrawer(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarNav links={links} />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </StaffUiContext.Provider>
  );
}

function Brand({ staff }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-4">
      <img src={logo} alt="" className="h-8 w-auto" />
      <div>
        <p className="text-sm font-extrabold tracking-wide">PWF</p>
        <p className="text-[10px] uppercase tracking-wider text-textMuted">
          {staff.isAdmin ? "Admin" : "Moderator"}
        </p>
      </div>
      <Shield className="ml-auto h-4 w-4 text-primary" />
    </div>
  );
}

function SidebarNav({ links }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Staff">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              isActive ? "bg-primary/15 text-primary font-semibold shadow-[inset_0_0_0_1px_rgba(255,184,0,0.25)]" : "text-textSecondary hover:bg-hover hover:text-textPrimary",
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
