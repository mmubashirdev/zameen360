import PropertyDetails from "../pages/propertyDetails"; 
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";

const marketplaceRoutes = [
  {
    path: "/",
    element: <DashboardHome />,
  },

  {
    path: "/marketplace",
    element: <DashboardHome />,
  },
  {
    path: "/post-property",
    element: <CreatePropertyPost />,
  },
  {
    path: "/property",
    element: <PropertyDetails />,
  },
];

export default marketplaceRoutes;
