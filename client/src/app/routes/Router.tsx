import { useRoutes } from "react-router-dom";
import AuthRoutes from "@features/auth/routes/AuthRoutes";
import marketplaceRoutes from "../../features/marketplace/routes/MarketplaceRoutes";
import { PropertyProvider } from "../../features/marketplace/components/context/PropertyContext";
import adminRoutes from "../../features/admin/routes/AdminRoutes";
export default function AppRouter() {
  const routes = useRoutes([...AuthRoutes, ...marketplaceRoutes, ...adminRoutes]);

  return (
    <PropertyProvider>
      {routes}
    </PropertyProvider>
    
  );
}
