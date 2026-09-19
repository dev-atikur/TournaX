import React, { createContext, useEffect, useState } from "react";

import api from "../api/api";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
       const response = await axios.post(
         "http://localhost:5000/api/auth/register",
         {
           username: "darkwolf91",
           email: "darkwolf91@example.com",
           password: "Wolf@58392",
           ffName: "亗DΛRK々WOLF",
           ffUid: "19384756210",
         },
       );

       console.log(response.data);
      } catch (error) {
        console.log("Auth check:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        // Login করা না থাকলে user null থাকবে
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Auth check failed:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
