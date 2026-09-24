import api from "./api";

export const reportApi = {
  create: (payload) => api.post("/api/user/reports", payload),
  list: (params) => api.get("/api/admin/reports", { params }),
  get: (id) => api.get(`/api/admin/reports/${id}`),
  update: (id, payload) => api.patch(`/api/admin/reports/${id}`, payload),
  // TODO: wire to dedicated count endpoint when backend exposes GET /api/admin/reports/pending-count
  pending: (params) => api.get("/api/admin/reports", { params: { status: "pending", limit: 1, ...params } }),
};

export default reportApi;
