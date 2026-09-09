import React from "react";
import { AuthContext } from "./AuthContexts";

export default function AuthProvider({ children }) {
  //🔹 Value
  const value = { isAuthenticated: false };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
