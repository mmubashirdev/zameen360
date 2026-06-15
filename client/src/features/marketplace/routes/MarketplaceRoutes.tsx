// client/src/features/marketplace/routes/Marketplace.routes.tsx
import PropertyDetails from "../pages/propertyDetail";
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import ProfilePage from "../pages/profile";
import Buy from "../pages/Buypage";
import AboutPage from "../pages/Aboutus";
import ContactUsPage from "../pages/ContactUs";
import SupportPage from "../pages/Support";
import Rent from "../rent/pages/Rent";
import MyListings from "../pages/MyListings";
import BuyerProfile from "../pages/BuyerProfile";  
import MediaAndDetail from "../pages/MediaAndDetail";
import ReviewSubmit from "../pages/ReviewSubmit";
import PropertySubmitted from "../pages/PropertySubmitted";
import MessagesPage from "@features/message/page/MessagesPage";



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
    path: "/property/:id",
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
    path: "/property-submitted",
    element: <PropertySubmitted />,
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
    path: "/messages",
    element: <MessagesPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  }
];

export { marketplaceRoutes };
export default marketplaceRoutes;