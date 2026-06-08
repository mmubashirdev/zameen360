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
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import PropertySubmitted from "../pages/PropertySubmitted"; // ⭐ ADD

const marketplaceRoutes = [
  { path: "/", element: <DashboardHome /> },
  { path: "/marketplace", element: <DashboardHome /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/post-property", element: <CreatePropertyPost /> },
  
  // ⭐ ADD THIS ROUTE
  { path: "/property-submitted", element: <PropertySubmitted /> },
  
  { path: "/property/:id", element: <PropertyDetails /> },
  { path: "/buy", element: <Buy /> },
  { path: "/rent", element: <Rent /> },
  { path: "/about-us", element: <AboutPage /> },
  { path: "/contact-us", element: <ContactUsPage /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/support", element: <SupportPage /> },
];

export { marketplaceRoutes };
export default marketplaceRoutes;