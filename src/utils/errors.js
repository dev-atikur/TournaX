export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  const message = error?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (error?.code === "ERR_NETWORK") return "Unable to reach the server. Check your connection.";
  return fallback;
}

export function extractList(payload) {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return { items: data, pagination: null };
  if (Array.isArray(data?.items)) {
    return { items: data.items, pagination: data.pagination || null };
  }
  return { items: [], pagination: data?.pagination || null };
}

export function extractEntity(payload) {
  return payload?.data ?? payload ?? null;
}
