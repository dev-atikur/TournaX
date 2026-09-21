import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../utils/errors";
import notificationApi from "../../api/notification.api";

const navLinkClass = ({ isActive }) =>
  clsx(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-surfaceMuted text-textPrimary" : "text-textSecondary hover:bg-hover hover:text-textPrimary",
  );

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setOpen(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      toast.error(getApiError(error, "Logout failed"));
    }
  };

  const role = user?.role;
  const publicLinks = [
    ["/", "Home"],
    ["/tournaments", "Tournaments"],
    ["/matches", "Matches"],
    ["/leaderboard", "Leaderboard"],
  ];

  return (
    <header className="relative flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-surfaceHard px-4 sm:px-5">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Play With Fair" className="h-9 w-auto object-contain sm:h-10" />
        <span className="sr-only">PWF</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
        {publicLinks.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        {loading ? null : isAuthenticated ? (
          <>
            {role === "admin" ? (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            ) : null}
            {role === "moderator" ? (
              <NavLink to="/moderator" className={navLinkClass}>
                Moderator
              </NavLink>
            ) : null}
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <Link
              to="/notifications"
              className="relative rounded-lg p-2 text-textSecondary hover:bg-hover hover:text-textPrimary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
              ) : null}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-textSecondary hover:bg-hover hover:text-textPrimary"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-textDark hover:bg-primaryHover"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className="rounded-lg p-2 text-textSecondary hover:bg-hover md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-border bg-surfaceHard p-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {publicLinks.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <NavLink to="/notifications" className={navLinkClass}>Notifications</NavLink>
                {role === "admin" ? <NavLink to="/admin" className={navLinkClass}>Admin</NavLink> : null}
                {role === "moderator" ? <NavLink to="/moderator" className={navLinkClass}>Moderator</NavLink> : null}
                <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-textSecondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className={navLinkClass}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
