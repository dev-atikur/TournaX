import api from "./api";

export const notificationApi = {
  list: (params) => api.get("/api/notifications", { params }),
  markRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch("/api/notifications/read-all"),
};

export default notificationApi;
