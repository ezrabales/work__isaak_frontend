import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;
