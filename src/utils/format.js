export function formatDateTime(value) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMoney(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "৳0";
  if (amount === 0) return "Free";
  return `৳${amount.toLocaleString()}`;
}

export function formatStatus(status) {
  if (!status) return "Unknown";
  return String(status)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function timeAgo(value) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function entityId(item) {
  return item?.id || item?._id || "";
}

export function displayName(user) {
  if (!user) return "Unknown";
  return user.fullName || user.username || user.email || "Player";
}

export function avatarUrl(user, fallback = "PWF") {
  return (
    user?.profilePicture ||
    user?.avatar ||
    `https://ui-avatars.com/api/?background=1b1e28&color=f5f7fa&name=${encodeURIComponent(
      user?.fullName || user?.username || fallback,
    )}`
  );
}

export function toDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

export function remainingTime(value) {
  if (!value) return "No expiry";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"}`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${Math.max(1, minutes)} min`;
}

export function normalizePagination(pagination, fallback = {}) {
  const page = Number(pagination?.page || pagination?.currentPage || fallback.page || 1);
  const limit = Number(pagination?.limit || fallback.limit || 20);
  const total = Number(pagination?.total || pagination?.count || 0);
  const totalPages = Number(pagination?.totalPages || pagination?.pages || Math.max(1, Math.ceil(total / limit) || 1));
  return { page, limit, total, totalPages };
}

export function shortId(value) {
  const id = String(value || "");
  if (id.length <= 8) return id || "—";
  return id.slice(-6).toUpperCase();
}

export function getBanInfo(user) {
  const ban = user?.ban || user?.banInfo || {};
  const isBanned = Boolean(user?.isBanned || user?.banned || ban?.active || user?.status === "banned");
  const type = (ban.type || user?.banType || (isBanned ? "permanent" : "")).toLowerCase();
  const expiresAt = ban.expiresAt || ban.expires || user?.banExpiresAt || user?.bannedUntil || null;
  return {
    isBanned,
    type: type === "temporary" || expiresAt ? "temporary" : isBanned ? "permanent" : "",
    reason: ban.reason || user?.banReason || "",
    notes: ban.notes || user?.banNotes || "",
    bannedBy: ban.bannedBy || user?.bannedBy || null,
    bannedAt: ban.bannedAt || user?.bannedAt || null,
    expiresAt,
    duration: ban.duration || user?.banDuration || "",
  };
}
