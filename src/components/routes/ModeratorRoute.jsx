import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";

export default function ModeratorRoute({ children }) {
  const { user } = useAuth();
  const allowed = user?.role === "moderator" || user?.role === "admin";

  return (
    <ProtectedRoute>
      {allowed ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}
