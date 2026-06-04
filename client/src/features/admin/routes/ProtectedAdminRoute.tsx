// client/src/features/admin/routes/ProtectedAdminRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  // TODO: Replace with your actual auth check
  // Example checks:
  // const token = localStorage.getItem("adminToken");
  // const user = useSelector((state) => state.auth.user);
  // const isAdmin = user?.role === "admin";

  const token = localStorage.getItem("adminToken");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
