export function profilePath(userOrUsername) {
  const username = typeof userOrUsername === "string" ? userOrUsername : userOrUsername?.username;
  if (!username) return "/login";
  return `/profile/${encodeURIComponent(username)}`;
}

const PUBLIC_FIELDS = [
  "id",
  "_id",
  "username",
  "fullName",
  "ffName",
  "bio",
  "profilePicture",
  "avatar",
  "socialLinks",
  "createdAt",
  "totalMatches",
  "totalWins",
  "totalKills",
  "totalPoints",
  "tournamentsPlayed",
  "tournamentsWon",
  "rank",
  "leaderboardRank",
  "recentTournaments",
  "recentMatches",
  "recentResults",
  "isBanned",
];

export function toPublicProfile(raw) {
  if (!raw || typeof raw !== "object") return null;
  const next = {};
  PUBLIC_FIELDS.forEach((key) => {
    if (raw[key] !== undefined) next[key] = raw[key];
  });
  return next;
}

export function socialList(user) {
  const links = user?.socialLinks;
  if (Array.isArray(links)) {
    return links.filter((item) => item?.url);
  }
  return [
    user?.instagram && { platform: "instagram", url: user.instagram },
    user?.telegram && { platform: "telegram", url: user.telegram },
    user?.youtube && { platform: "youtube", url: user.youtube },
    user?.facebook && { platform: "facebook", url: user.facebook },
  ].filter(Boolean);
}
