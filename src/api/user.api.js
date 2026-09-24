import api from "./api";

export const userApi = {
  getMe: () => api.get("/api/user/me"),
  getPublicProfile: (username) => api.get(`/api/users/${encodeURIComponent(username)}`),
  updateProfile: (payload) => api.patch("/api/user/me", payload),
  updateAccount: (payload) => api.patch("/api/user/me/account", payload),
  createReport: (payload) => api.post("/api/user/reports", payload),
  getNotificationSettings: () => api.get("/api/user/notification-settings"),
  updateNotificationSettings: (payload) => api.patch("/api/user/notification-settings", payload),
  getPrivacySettings: () => api.get("/api/user/privacy"),
  updatePrivacySettings: (payload) => api.patch("/api/user/privacy", payload),
  deleteAccount: (payload) => api.delete("/api/user/me", { data: payload }),
  deactivateAccount: (payload) => api.patch("/api/user/me/deactivate", payload),
};

export default userApi;
