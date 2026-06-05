// client/src/features/admin/routes/ProtectedAdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const isValidAdmin = (): boolean => {
    try {
      const raw = localStorage.getItem("admin");
      if (!raw) return false;

      const data = JSON.parse(raw);

      // ✅ Check role instead of token
      if (data?.role !== "ADMIN") return false;

      // ✅ Check email exists (basic sanity check)
      if (!data?.email) return false;

      return true;
    } catch {
      localStorage.removeItem("admin");
      return false;
    }
  };

  return isValidAdmin() ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
