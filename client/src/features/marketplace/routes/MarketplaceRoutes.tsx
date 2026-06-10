import PropertyDetails from "../pages/propertyDetails";
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import MediaAndDetail from "../pages/MediaAndDetail";
import ProfilePage from "../pages/profile";
import ReviewSubmit from "../pages/ReviewSubmit";
import Buy from "../pages/Buypage";
import AboutPage from "../pages/Aboutus";
import ContactUsPage from "../pages/Contactus";
import Rent from "../rent/pages/Rent";
import MyListings from "../pages/MyListings";
import BuyerProfile from "../pages/BuyerProfile";  // ⬅️ NEW

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
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/buyer-profile",        // ⬅️ NEW ROUTE
    element: <BuyerProfile />,
  },
  {
    path: "/my-listings",
    element: <MyListings />,
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
  },
  {
    path: "/buy",
    element: <Buy />,
  },
  {
    path: "/rent",
    element: <Rent />,
  },
  {
    path: "/about-us",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactUsPage />,
  },
];

export { marketplaceRoutes };
export default marketplaceRoutes;