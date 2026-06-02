import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../adminDashboard";
import AllListings from "../AllListing";
import PendingApproval from "../PendingApproval";
import Approved from "../Approved";
import Rejected from "../Rejected";

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