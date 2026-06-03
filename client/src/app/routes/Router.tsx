import { useRoutes } from "react-router-dom";
import AuthRoutes from "@features/auth/routes/AuthRoutes";
import marketplaceRoutes from "../../features/marketplace/routes/MarketplaceRoutes";
import AdminRoutes from "@features/admin/routes/AdminRoutes";
import { PropertyProvider } from "../../features/marketplace/components/context/PropertyContext";

export default function AppRouter() {
  const routes = useRoutes([...AuthRoutes, ...AdminRoutes, ...marketplaceRoutes]);

  return (
    <PropertyProvider>
      {routes}
    </PropertyProvider>
  );
}
