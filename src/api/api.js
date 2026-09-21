import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const url = original.url || "";

    const skipRefresh =
      url.includes("/api/auth/refresh") ||
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      original._retry;

    if (status === 401 && !skipRefresh) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/api/auth/refresh").finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        return api(original);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
