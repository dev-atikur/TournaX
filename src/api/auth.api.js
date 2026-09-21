import api from "./api";

export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get("/api/auth/me"),
  refresh: () => api.post("/api/auth/refresh"),
  forgotPassword: (payload) => api.post("/api/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/api/auth/reset-password", payload),
  verifyEmail: (payload) => api.post("/api/auth/verify-email", payload),
  resendVerification: (payload) => api.post("/api/auth/resend-verification", payload),
  verifyTwoFactor: (payload) => api.post("/api/auth/2fa/verify", payload),
  changePassword: (payload) => api.patch("/api/auth/change-password", payload),
};

export default authApi;
