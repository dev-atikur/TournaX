import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContexts";
import authApi from "../api/auth.api";
import { extractEntity } from "../utils/errors";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      setUser(extractEntity(response.data));
      return extractEntity(response.data);
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const response = await authApi.me();
        if (active) setUser(extractEntity(response.data));
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload) => {
    const response = await authApi.login(payload);
    const data = extractEntity(response.data);
    if (data && (data.id || data._id || data.email)) {
      setUser(data);
    } else {
      await refreshUser();
    }
    return response.data;
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: Boolean(user),
      refreshUser,
      login,
      logout,
    }),
    [user, loading, refreshUser, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
