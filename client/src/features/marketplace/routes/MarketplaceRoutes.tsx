import PropertyDetails from "../pages/propertyDetails";
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import MediaAndDetail from "../pages/MediaAndDetail";
import ProfilePage from "../pages/profile";
import ReviewSubmit from "../pages/ReviewSubmit";
import Buy from "../pages/Buypage";
import AboutPage from "../pages/Aboutus";
import ContactUsPage from "../pages/Contactus";
import SupportPage from "../pages/Support";
import Rent from "../rent/pages/Rent";
const marketplaceRoutes = [
  {
    path: "/",
    element: <DashboardHome />,
  },
  {
    path: "*",
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
    path: "/contact-us",
    element: <ContactUsPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
];

export default marketplaceRoutes;
