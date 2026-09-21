import api from "./api";

export const tournamentApi = {
  list: (params) => api.get("/api/tournaments", { params }),
  get: (id) => api.get(`/api/tournaments/${id}`),
  create: (payload) => api.post("/api/tournaments", payload),
  update: (id, payload) => api.patch(`/api/tournaments/${id}`, payload),
  updateStatus: (id, status) => api.patch(`/api/tournaments/${id}/status`, { status }),
  cancel: (id) => api.patch(`/api/tournaments/${id}/cancel`),
  register: (id) => api.post(`/api/tournaments/${id}/register`),
  unregister: (id) => api.delete(`/api/tournaments/${id}/register`),
  participants: (id, params) => api.get(`/api/tournaments/${id}/participants`, { params }),
  removeParticipant: (id, userId) => api.delete(`/api/tournaments/${id}/participants/${userId}`),
  leaderboard: (id, params) => api.get(`/api/tournaments/${id}/leaderboard`, { params }),
};

export default tournamentApi;
