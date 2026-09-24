import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../common/Spinner";

export default function ModeratorRoute({ children }) {
  const { user, loading } = useAuth();
  const allowed = user?.role === "moderator" || user?.role === "admin";

  return (
    <ProtectedRoute>
      {loading ? (
        <Spinner className="flex-1" />
      ) : allowed ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </ProtectedRoute>
  );
}
