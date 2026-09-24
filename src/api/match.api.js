import api from "./api";

export const matchApi = {
  list: (params) => api.get("/api/matches", { params }),
  get: (id) => api.get(`/api/matches/${id}`),
  create: (payload) => api.post("/api/matches", payload),
  update: (id, payload) => api.patch(`/api/matches/${id}`, payload),
  cancel: (id, payload) => api.patch(`/api/matches/${id}/cancel`, payload),
  submitResults: (id, payload) => api.post(`/api/matches/${id}/results`, payload),
  verifyResults: (id) => api.patch(`/api/matches/${id}/results/verify`),
};

export default matchApi;
