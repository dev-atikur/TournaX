export const GAME_MODES = ["Solo", "Duo", "Squad", "Clash Squad", "Lone Wolf"];

export const TOURNAMENT_STATUSES = {
  DRAFT: "draft",
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration_open",
  REGISTRATION_CLOSED: "registration_closed",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MATCH_STATUSES = {
  SCHEDULED: "scheduled",
  ROOM_READY: "room_ready",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MATCH_CATEGORIES = [
  {
    id: "full-map",
    title: "Full Map Matches",
    items: [
      {
        slug: "solo-full-map",
        title: "Solo Full Map",
        gameMode: "Solo",
        description: "Classic BR solo. Drop, survive, and clutch the Booyah.",
        icon: "crosshair",
      },
      {
        slug: "duo-full-map",
        title: "Duo Full Map",
        gameMode: "Duo",
        description: "Pair up and rotate smart across Bermuda, Purgatory, or Kalahari.",
        icon: "users",
      },
    ],
  },
  {
    id: "lone-wolf",
    title: "Lone Wolf Matches",
    items: [
      {
        slug: "br-survival",
        title: "BR Survival",
        gameMode: "Lone Wolf",
        description: "High-intensity survival rounds with limited loadouts.",
        icon: "shield",
      },
      {
        slug: "lone-wolf-2v2",
        title: "2 VS 2 Lone Wolf",
        gameMode: "Lone Wolf",
        description: "Fast 2v2 fights. Aim, timing, and utility win the round.",
        icon: "swords",
      },
    ],
  },
  {
    id: "bonus-clash",
    title: "Bonus and Clash Squad Matches",
    items: [
      {
        slug: "bonus-match",
        title: "Bonus Match",
        gameMode: "Squad",
        search: "bonus",
        description: "Extra-point and special-rule rooms for bonus ranking.",
        icon: "zap",
      },
      {
        slug: "clash-squad-4v4",
        title: "4 VS 4 Clash Squad",
        gameMode: "Clash Squad",
        description: "Tactical 4v4 clash. Coordinate, trade, and hold site.",
        icon: "gamepad",
      },
    ],
  },
];
