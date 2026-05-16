import { AuthProvider } from "@features/auth/context/AuthContext";
import AuthRoutes from "@features/auth/routes/AuthRoutes";
import DashboardRoutes from "../features/landing/routes/dashboardRoutes";
export default function AppRouter() {
  return (
    <>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
      <DashboardRoutes />
    </>

  );
}
