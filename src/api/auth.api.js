import api from "./api";

export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  logout: () => api.post("/api/auth/logout"),
  logoutBySessionId: (sessionId) => api.patch(`/api/auth/logout/${sessionId}`),
  logoutAll: () => api.patch("/api/auth/logout-all"),
  refresh: () => api.post("/api/auth/refresh"),

  changePassword: (payload) => api.patch("/api/auth/change-password", payload),
  forgotPassword: (payload) => api.post("/api/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/api/auth/reset-password", payload),

  setup2FA: (payload) => api.post("/api/auth/2fa/setup", payload),
  setup2FAByMethod: (method) => api.patch(`/api/auth/2fa/setup/${method}`),
  verifyTwoFactor: (payload) => api.post("/api/auth/2fa/verify", payload),
  resendTwoFactorCode: (payload) => api.post("/api/auth/2fa/resend", payload),
  switchTwoFactorMethod: (payload) => api.post("/api/auth/2fa/switch-method", payload),
  disable2FA: () => api.patch("/api/auth/2fa/disable"),
};


export default authApi;