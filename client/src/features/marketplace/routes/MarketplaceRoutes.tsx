// client/src/features/marketplace/routes/Marketplace.routes.tsx
import PropertyDetails from "../pages/propertyDetails";
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import ProfilePage from "../pages/profile";
import Buy from "../pages/Buypage";
import AboutPage from "../pages/Aboutus";
import ContactUsPage from "../pages/ContactUs";
import SupportPage from "../pages/Support";
import Rent from "../rent/pages/Rent";
import BuyerProfile from "../pages/BuyerProfile";
import MediaAndDetail from "../pages/MediaAndDetail";
import ReviewSubmit from "../pages/ReviewSubmit";
import PropertySubmitted from "../pages/PropertySubmitted";
import MessagesPage from "@features/message/page/MessagesPage";
import TermsOfService from "../components/term&policy/Termsofservice";
import PrivacyPolicy from "../components/term&policy/Privacypolicy";
import VirtualTourPage from "../../marketplace/pages/VirtualTourPage";
import SchemesPage from "@features/schemes/pages/SchemesPage";

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
    path: "/buyer-profile", // ⬅️ NEW ROUTE
    element: <BuyerProfile />,
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
  },
  {
    path: "/property/:id/virtual-tour",
    element: <VirtualTourPage />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },

  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/Societies",
    element: <SchemesPage />,
  },
];

export { marketplaceRoutes };
export default marketplaceRoutes;
