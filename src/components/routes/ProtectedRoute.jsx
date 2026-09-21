import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../common/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
