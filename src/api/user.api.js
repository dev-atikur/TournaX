import api from "./api";

export const userApi = {
  getMe: () => api.get("/api/user/me"),
  updateProfile: (payload) => api.patch("/api/user/me", payload),
  createReport: (payload) => api.post("/api/user/reports", payload),
};

export default userApi;
