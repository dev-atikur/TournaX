import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { profilePath } from "../../utils/profile";
import logo from "../../assets/logo.png";

export default function Footer() {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-border bg-surfaceHard">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-auto object-contain" />
              <span>
                <span className="block text-xl font-bold">
                  Play With <span className="text-primary">Fair</span>
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-textMuted">
                  Play. Compete. Win. Fair.
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-textMuted">
              A professional Free Fire tournament platform built for fair competition, verified results, and
              trusted rooms.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-textMuted transition hover:border-primary/40 hover:text-primary"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/"
                aria-label="Telegram"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-textMuted transition hover:border-primary/40 hover:text-primary"
              >
                <FaTelegramPlane className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm text-textSecondary">
              <li><Link className="hover:text-primary" to="/">Home</Link></li>
              <li><Link className="hover:text-primary" to="/tournaments">Tournaments</Link></li>
              <li><Link className="hover:text-primary" to="/matches">Matches</Link></li>
              <li><Link className="hover:text-primary" to="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted">Account</h3>
            <ul className="mt-4 space-y-3 text-sm text-textSecondary">
              {isAuthenticated ? (
                <>
                  <li><Link className="hover:text-primary" to="/dashboard">Dashboard</Link></li>
                  {user?.username ? (
                    <li><Link className="hover:text-primary" to={profilePath(user)}>Profile</Link></li>
                  ) : null}
                  <li><Link className="hover:text-primary" to="/settings">Settings</Link></li>
                </>
              ) : (
                <>
                  <li><Link className="hover:text-primary" to="/login">Login</Link></li>
                  <li><Link className="hover:text-primary" to="/register">Register</Link></li>
                </>
              )}
              <li><Link className="hover:text-primary" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:text-primary" to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-textMuted">
          <span>© {new Date().getFullYear()} Play With Fair. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            PWF · Free Fire Tournaments
          </span>
        </div>
      </div>
    </footer>
  );
}
