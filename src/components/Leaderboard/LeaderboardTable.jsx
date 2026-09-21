import { clsx } from "clsx";

export default function LeaderboardTable({ rows = [], highlightId }) {
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const top = row.rank <= 3;
            return (
              <tr
                key={row.id || row.rank}
                className={clsx(
                  "border-t border-border",
                  highlightId && String(row.id) === String(highlightId) && "bg-primary/5",
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
                    <span className="font-medium">{row.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-textSecondary">{row.ffName}</td>
                <td className="px-4 py-3">{row.totalMatches ?? 0}</td>
                <td className="px-4 py-3">{row.totalWins ?? 0}</td>
                <td className="px-4 py-3">{row.totalKills ?? 0}</td>
                <td className="px-4 py-3 font-semibold">{row.totalPoints ?? 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
