import PropertyDetails from "../pages/propertyDetails";
import DashboardHome from "../pages/Marketplace";
import CreatePropertyPost from "../pages/CreatePropertyPost";
import MediaAndDetail from "../pages/MediaAndDetail";

import ReviewSubmit from "../pages/ReviewSubmit";
import Buy from "../pages/Buypage";
import AboutPage from "../pages/Aboutus";
<<<<<<< HEAD
import ContactUsPage from "../pages/contactus";
=======
import ContactUs from "../pages/ContactUs";
import Rent from "../rent/pages/Rent";
>>>>>>> 3680745716ae3071bd316f2d0d3a67d38429088b
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
<<<<<<< HEAD
    path: "/contact",
    element: <ContactUsPage />,
  },
=======
    path: "/contact-us",
    element: <ContactUs />
  }
>>>>>>> 3680745716ae3071bd316f2d0d3a67d38429088b
];

export default marketplaceRoutes;
