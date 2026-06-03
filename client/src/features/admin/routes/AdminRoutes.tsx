import AdminLayout from "../components/AdminLayout.tsx";
import AdminDashboard from "../adminDashboard.tsx";
import AllListings from "../AllListing.tsx";
import PendingApproval from "../PendingApproval.tsx";
import Approved from "../Approved.tsx";
import Rejected from "../Rejected.tsx";

const AdminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "all-listings", element: <AllListings /> },
      { path: "pending", element: <PendingApproval /> },
      { path: "approved", element: <Approved /> },
      { path: "rejected", element: <Rejected /> },
    ],
  },
];

export default AdminRoutes;