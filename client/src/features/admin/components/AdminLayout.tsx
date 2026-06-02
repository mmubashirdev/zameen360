import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminApi";
import "../styles/admin.css";

function AdminLayout() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState<number>(0);

  function loadPendingCount() {
    getDashboardStats()
      .then((data) => setPendingCount(data.pending))
      .catch((err: unknown) => console.log(err));
  }

  useEffect(() => {
    loadPendingCount();
  }, [location.pathname]);

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  return (
    <div className="admin-app">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon">🏠</div>
          <div>
            <h2>Zameen 360</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        <ul className="admin-menu">
          <li>
            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/all-listings"
              className={isActive("/admin/all-listings") ? "active" : ""}
            >
              🏠 All Listings
            </Link>
          </li>
          <li>
            <Link
              to="/admin/pending"
              className={isActive("/admin/pending") ? "active" : ""}
            >
              📋 Pending Approval
              {pendingCount > 0 && (
                <span className="badge">{pendingCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/approved"
              className={isActive("/admin/approved") ? "active" : ""}
            >
              ✅ Approved
            </Link>
          </li>
          <li>
            <Link
              to="/admin/rejected"
              className={isActive("/admin/rejected") ? "active" : ""}
            >
              ❌ Rejected
            </Link>
          </li>
        </ul>
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-user">
            <div className="topbar-avatar">A</div>
            <span>Admin</span>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;