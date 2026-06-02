import { useEffect, useState } from "react";
import { getDashboardStats } from "../admin/services/adminApi";
import type { DashboardStats } from "../admin/services/adminApi";

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function loadStats() {
    setLoading(true);
    getDashboardStats()
      .then((data: DashboardStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!stats) return <div className="loading">No data</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin!</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">🏠</div>
          <h3>{stats.total}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <h3>{stats.pending}</h3>
          <p>Pending Approval</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;