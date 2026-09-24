import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/common/Spinner";
import { profilePath } from "../utils/profile";

export default function ProfileRedirectPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner label="Loading profile" />
      </div>
    );
  }

  if (isAuthenticated && user?.username) {
    return <Navigate to={profilePath(user)} replace />;
  }

  return <Navigate to="/login" replace />;
}
