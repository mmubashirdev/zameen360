import PropertyDetails from "../pages/propertyDetails"; 
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import MediaAndDetail from "../pages/MediaAndDetail"
// import ReiewSubmit from "../pages/ReviewSubmit"
import ReviewSubmit from "../pages/ReviewSubmit";

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

{
  path: "/media-and-details",
  element: <MediaAndDetail />,
},
{
  path: "/review",
  element: <ReviewSubmit />,
}
];

export default marketplaceRoutes;
