import { useState } from "react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import ReportUserModal from "../admin/ReportUserModal";
import useAuth from "../../hooks/useAuth";
import { profilePath } from "../../utils/profile";

export default function LeaderboardTable({ rows = [], highlightId }) {
  const { user, isAuthenticated } = useAuth();
  const [reportTarget, setReportTarget] = useState(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surfaceMuted text-textMuted">
          <tr>
            <th className="px-4 py-3 font-medium">Rank</th>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">FF Name</th>
            <th className="px-4 py-3 font-medium">Matches</th>
            <th className="px-4 py-3 font-medium">Wins</th>
            <th className="px-4 py-3 font-medium">Kills</th>
            <th className="px-4 py-3 font-medium">Points</th>
            <th className="px-4 py-3 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const top = row.rank <= 3;
            const id = row.id || row._id || row.userId;
            const isSelf = user && String(user.id || user._id) === String(id);
            return (
              <tr
                key={id || row.rank}
                className={clsx(
                  "border-t border-border",
                  highlightId && String(id) === String(highlightId) && "bg-primary/5",
                  top && "bg-surfaceSoft",
                )}
              >
                <td className="px-4 py-3 font-semibold text-primary">{row.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={row.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.username || "PWF")}`}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {row.username ? (
                      <Link to={profilePath(row.username)} className="font-medium hover:text-primary">
                        {row.username}
                      </Link>
                    ) : (
                      <span className="font-medium">{row.username}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-textSecondary">{row.ffName}</td>
                <td className="px-4 py-3">{row.totalMatches ?? 0}</td>
                <td className="px-4 py-3">{row.totalWins ?? 0}</td>
                <td className="px-4 py-3">{row.totalKills ?? 0}</td>
                <td className="px-4 py-3 font-semibold">{row.totalPoints ?? 0}</td>
                <td className="px-4 py-3">
                  {isAuthenticated && !isSelf ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-error hover:underline"
                      onClick={() => setReportTarget(row)}
                    >
                      Report
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReportUserModal open={Boolean(reportTarget)} user={reportTarget} onClose={() => setReportTarget(null)} />
    </div>
  );
}
