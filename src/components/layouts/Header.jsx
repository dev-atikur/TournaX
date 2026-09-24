import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  Swords,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../utils/errors";
import notificationApi from "../../api/notification.api";
import { avatarUrl, displayName } from "../../utils/format";
import { profilePath } from "../../utils/profile";
import Button from "../common/Button";

const publicNav = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/matches", label: "Matches", icon: Swords },
  { to: "/leaderboard", label: "Leaderboard", icon: Shield },
];

const navLinkClass = ({ isActive }) =>
  clsx(
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition duration-200",
    isActive
      ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(255,184,0,0.35)]"
      : "text-textSecondary hover:bg-hover hover:text-textPrimary",
  );

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnread(0);
      return undefined;
    }
    let active = true;
    notificationApi
      .list({ unread: "true", limit: 1 })
      .then((res) => {
        if (active) setUnread(res.data?.data?.pagination?.total || 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      toast.error(getApiError(error, "Logout failed"));
    }
  };

  const submitSearch = (event) => {
    event?.preventDefault();
    const value = query.trim();
    navigate(value ? `/tournaments?search=${encodeURIComponent(value)}` : "/tournaments");
    setSearchOpen(false);
    setOpen(false);
  };

  const role = user?.role;
  const accountLinks = useMemo(() => {
    const links = [];
    if (role === "admin") links.push({ to: "/admin", label: "Admin", icon: Shield });
    if (role === "moderator") links.push({ to: "/moderator", label: "Moderator", icon: Shield });
    links.push({ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard });
    if (user?.username) links.push({ to: profilePath(user), label: "Profile", icon: UserRound });
    links.push({ to: "/settings", label: "Settings", icon: Settings });
    return links;
  }, [role, user]);

  return (
    <header className="relative z-40 flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-surfaceHard/95 px-3 backdrop-blur sm:px-5">
      <Link to="/" className="flex min-w-0 items-center gap-2.5">
        <img
          src={logo}
          alt="Play With Fair"
          className="h-9 w-auto object-contain sm:h-10"
        />
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-extrabold tracking-wide text-textPrimary sm:text-base">
            PWF
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-textMuted sm:block">
            Play With Fair
          </span>
          <span className="hidden text-[9px] uppercase tracking-[0.14em] text-primary/80 lg:block">
            Free Fire Tournaments
          </span>
        </span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
        {publicNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navLinkClass}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden items-center gap-1.5 md:flex">
        <div className="relative" ref={searchRef}>
          <button
            type="button"
            className="rounded-xl p-2 text-textSecondary transition hover:bg-hover hover:text-textPrimary"
            aria-label="Search"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search className="h-5 w-5" />
          </button>
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                onSubmit={submitSearch}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-11 w-72 rounded-xl border border-border bg-surface p-2 shadow-xl"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tournaments..."
                  className="w-full rounded-lg border border-border bg-surfaceHard px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </motion.form>
            ) : null}
          </AnimatePresence>
        </div>

        {isAuthenticated ? (
          <>
            <Link
              to="/notifications"
              className="relative rounded-xl p-2 text-textSecondary transition hover:bg-hover hover:text-textPrimary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
              ) : null}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full overflow-hidden w-8 h-8 border border-primary"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <img
                  src={avatarUrl(user)}
                  alt=""
                  className="w-full h-full"
                />
              </button>
              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                    role="menu"
                  >
                    <div className="border-b border-border p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl(user)}
                          alt=""
                          className="h-11 w-11 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {displayName(user)}
                          </p>
                          <p className="truncate text-xs text-textMuted">
                            @{user?.username}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            {role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      {accountLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-textSecondary hover:bg-hover hover:text-textPrimary"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-error/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary"
            >
              Login
            </Link>
            <Button as={Link} to="/register" size="sm">
              Register
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 md:hidden">
        {isAuthenticated ? (
          <Link
            to="/notifications"
            className="relative rounded-lg p-2 text-textSecondary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
            ) : null}
          </Link>
        ) : null}
        <button
          type="button"
          className="rounded-lg p-2 text-textSecondary hover:bg-hover"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-16 z-40 border-b border-border bg-surfaceHard p-4 md:hidden"
          >
            <form onSubmit={submitSearch} className="mb-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tournaments..."
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </form>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  {accountLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={navLinkClass}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-left text-sm text-error"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={navLinkClass}>
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
