// client/src/features/admin/routes/AdminRoutes.tsx
import type { RouteObject } from "react-router-dom";
import AdminLoginPage from "../adminLogin/pages/AdminLoginPage";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../adminDashboard";
import AllListings from "../AllListing";
import PendingApproval from "../PendingApproval";
import Approved from "../Approved";
import Rejected from "../Rejected";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminSocietiesList from "../pages/AdminSocietiesList";
import AdminSocietyDetails from "../pages/AdminSocietyDetails";

const AdminRoutes: RouteObject[] = [
  // PUBLIC — no auth guard
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },

  // PROTECTED — wrapped in auth guard via element
  {
    element: <ProtectedAdminRoute />, // Outlet-based guard
    children: [
      {
        path: "/admin",
        element: <AdminLayout />, // Layout with Outlet
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "all-listings", element: <AllListings /> },
          { path: "pending", element: <PendingApproval /> },
          { path: "approved", element: <Approved /> },
          { path: "rejected", element: <Rejected /> },
          { path: "societies", element: <AdminSocietiesList /> },
          { path: "societies/:id", element: <AdminSocietyDetails /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
