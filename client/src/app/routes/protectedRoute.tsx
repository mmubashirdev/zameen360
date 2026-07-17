import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../../features/auth/hooks/useAuth";
import { VERIFY_EMAIL_PENDING_EMAIL_KEY } from "../../features/auth/constants/authConstants";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();
  const isVerifyEmailRoute = location.pathname === "/verify-email";
  const hasPendingVerification = Boolean(
    sessionStorage.getItem(VERIFY_EMAIL_PENDING_EMAIL_KEY) ||
      location.state
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && !(isVerifyEmailRoute && hasPendingVerification)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;