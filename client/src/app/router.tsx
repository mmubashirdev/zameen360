import { useRoutes } from "react-router-dom";
import AuthRoutes from "@features/auth/routes/AuthRoutes";
import marketplaceRoutes from "../features/landing/routes/dashboardRoutes";

export default function AppRouter() {
  const routes = useRoutes([...AuthRoutes, ...marketplaceRoutes]);

  return routes;
}
