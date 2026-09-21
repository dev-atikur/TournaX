import api from "./api";

export const adminApi = {
  listUsers: (params) => api.get("/api/admin/users", { params }),
  banUser: (id, payload) => api.patch(`/api/admin/users/${id}/ban`, payload),
  unbanUser: (id) => api.patch(`/api/admin/users/${id}/unban`),
  updateUserRole: (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }),
  listReports: (params) => api.get("/api/admin/reports", { params }),
  updateReport: (id, payload) => api.patch(`/api/admin/reports/${id}`, payload),
  createTournament: (payload) => api.post("/api/admin/tournaments", payload),
  updateTournament: (id, payload) => api.patch(`/api/admin/tournaments/${id}`, payload),
  createMatch: (payload) => api.post("/api/admin/matches", payload),
  updateMatch: (id, payload) => api.patch(`/api/admin/matches/${id}`, payload),
};

export default adminApi;
