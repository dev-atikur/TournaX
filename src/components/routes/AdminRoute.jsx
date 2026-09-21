import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../common/Spinner";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  return (
    <ProtectedRoute>
      {loading ? (
        <Spinner className="flex-1" />
      ) : user?.role === "admin" ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </ProtectedRoute>
  );
}
