import api from "./api";

export const adminApi = {
  listUsers: (params) => api.get("/api/admin/users", { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, payload) => api.patch(`/api/admin/users/${id}`, payload),
  // TODO: replace composed dashboard fetches with GET /api/admin/stats when available
  getStats: (params) => api.get("/api/admin/stats", { params }),
  getUserActivity: (id, params) => api.get(`/api/admin/users/${id}/activity`, { params }),
  banUser: (id, payload) => api.patch(`/api/admin/users/${id}/ban`, payload),
  unbanUser: (id, payload) => api.patch(`/api/admin/users/${id}/unban`, payload),
  extendBan: (id, payload) => api.patch(`/api/admin/users/${id}/ban/extend`, payload),
  updateBan: (id, payload) => api.patch(`/api/admin/users/${id}/ban`, payload),
  updateUserRole: (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }),
  listReports: (params) => api.get("/api/admin/reports", { params }),
  getReport: (id) => api.get(`/api/admin/reports/${id}`),
  updateReport: (id, payload) => api.patch(`/api/admin/reports/${id}`, payload),
  createTournament: (payload) => api.post("/api/admin/tournaments", payload),
  updateTournament: (id, payload) => api.patch(`/api/admin/tournaments/${id}`, payload),
  deleteTournament: (id) => api.delete(`/api/admin/tournaments/${id}`),
  createMatch: (payload) => api.post("/api/admin/matches", payload),
  updateMatch: (id, payload) => api.patch(`/api/admin/matches/${id}`, payload),
  cancelMatch: (id, payload) => api.patch(`/api/admin/matches/${id}/cancel`, payload),
  // TODO: platform settings endpoints
  getSettings: () => api.get("/api/admin/settings"),
  updateSettings: (payload) => api.patch("/api/admin/settings", payload),
};

export default adminApi;
