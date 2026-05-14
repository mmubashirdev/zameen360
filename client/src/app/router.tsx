import { BrowserRouter } from "react-router-dom";
import { AuthProvider }  from "@features/auth/context/AuthContext";
import AuthRoutes        from "@features/auth/routes/AuthRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}