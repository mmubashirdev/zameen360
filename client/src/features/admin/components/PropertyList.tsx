import { useEffect, useState } from "react";
import {
  getAdminProperties,
  updatePropertyStatus,
} from "../services/adminApi";
import type { AdminProperty } from "../services/adminApi";
import PropertyDetail from "./PropertyDetail";

interface Props {
  statusFilter: string;
  title: string;
  subtitle: string;
}

// API response type
interface PropertiesResponse {
  success: boolean;
  data: AdminProperty[];
  total: number;
  page: number;
  totalPages: number;
}

function PropertyList({ statusFilter, title, subtitle }: Props) {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<AdminProperty | null>(null);

  function loadProperties() {
    setLoading(true);
    getAdminProperties(statusFilter, search, page)
      .then((res: PropertiesResponse) => {
        setProperties(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProperties();
  }, [page, statusFilter]);

  function formatPrice(price: string | number | null): string {
    if (!price) return "N/A";
    return "PKR " + Number(price).toLocaleString();
  }

  function getTimeAgo(dateStr: string): string {
    const now = new Date();
    const created = new Date(dateStr);
    const diff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return diff + " days ago";
  }

  function handleApprove(id: number) {
    updatePropertyStatus(id, "approved")
      .then(() => {
        alert("Approved!");
        loadProperties();
      })
      .catch(() => alert("Error"));
  }

  function handleReject(id: number) {
    updatePropertyStatus(id, "rejected")
      .then(() => {
        alert("Rejected!");
        loadProperties();
      })
      .catch(() => alert("Error"));
  }

  function handleStatusChange() {
    setSelected(null);
    loadProperties();
  }

  function getBadgeClass() {
    if (statusFilter === "approved") return "approved";
    if (statusFilter === "rejected") return "rejected";
    return "";
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <span className={"status-badge-header " + getBadgeClass()}>
          {total} listings
        </span>
      </div>

      <div className="filters">
        <input
          className="filter-search"
          type="text"
          placeholder="Search by title, city, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="filter-btn"
          onClick={() => {
            setPage(1);
            loadProperties();
          }}
        >
          🔄 Search
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <div className="table-container">
          <table className="property-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Price</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 && (
                <tr>
                  <td colSpan={6} className="no-data">
                    No properties found
                  </td>
                </tr>
              )}
              {properties.map((p: AdminProperty) => (
                <tr key={p.id}>
                  <td>
                    <div className="property-cell">
                      <img
                        className="property-thumb"
                        src={
                          p.images && p.images.length > 0
                            ? p.images[0]
                            : "https://via.placeholder.com/60x45"
                        }
                        alt={p.title || ""}
                      />
                      <div className="property-info">
                        <h4>{p.title || "Untitled"}</h4>
                        <p>{p.locality || p.city || "N/A"}</p>
                        <p>ID: Z360-{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="type-badge">
                      {p.propertyType || "N/A"}
                    </span>
                  </td>
                  <td className="price-text">{formatPrice(p.price)}</td>
                  <td>{getTimeAgo(p.createdAt)}</td>
                  <td>
                    <span className={"status-badge " + p.status}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelected(p)}
                      >
                        👁️ View
                      </button>
                      {p.status === "pending" && (
                        <div className="action-row">
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(p.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(p.id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {total > 0 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span style={{ padding: "8px 14px" }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {selected && (
        <PropertyDetail
          property={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default PropertyList;