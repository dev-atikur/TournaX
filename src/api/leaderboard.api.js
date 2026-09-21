import api from "./api";

export const leaderboardApi = {
  global: (params) => api.get("/api/leaderboard/global", { params }),
  tournament: (id, params) => api.get(`/api/leaderboard/tournaments/${id}`, { params }),
};

export default leaderboardApi;
