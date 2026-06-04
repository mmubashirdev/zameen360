// client/src/features/admin/routes/AdminRoutes.tsx
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../adminDashboard";
import AllListings from "../AllListing";
import PendingApproval from "../PendingApproval";
import Approved from "../Approved";
import Rejected from "../Rejected";
import AdminLoginPage from "../adminLogin/pages/AdminLoginPage";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AdminRoutes = [
  // Public Admin Login Route (NOT inside layout)
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },

  // Protected Admin Routes (wrapped in layout + auth guard)
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
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
