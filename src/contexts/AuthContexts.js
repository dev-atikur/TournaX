import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});
