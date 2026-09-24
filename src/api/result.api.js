import api from "./api";

export const resultApi = {
  // TODO: confirm list path against backend; currently matches staff results collection
  list: (params) => api.get("/api/admin/results", { params }),
  get: (id) => api.get(`/api/admin/results/${id}`),
  update: (id, payload) => api.patch(`/api/admin/results/${id}`, payload),
  verify: (id) => api.patch(`/api/admin/results/${id}/verify`),
  reject: (id, payload) => api.patch(`/api/admin/results/${id}/reject`, payload),
};

export default resultApi;
