import { updatePropertyStatus } from "../services/adminApi";
import type { AdminProperty } from "../services/adminApi";

interface Props {
  property: AdminProperty;
  onClose: () => void;
  onStatusChange: () => void;
}

function PropertyDetail({ property, onClose, onStatusChange }: Props) {
  function formatPrice(price: string | number | null): string {
    if (!price) return "Price not set";
    return "PKR " + Number(price).toLocaleString();
  }

  function getTimeAgo(dateStr: string): string {
    const now = new Date();
    const created = new Date(dateStr);
    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return diffDays + " days ago";
  }

  function handleApprove() {
    updatePropertyStatus(property.id, "approved")
      .then(() => {
        alert("Property approved!");
        onStatusChange();
      })
      .catch((err: unknown) => {
        console.log(err);
        alert("Error approving property");
      });
  }

  function handleReject() {
    updatePropertyStatus(property.id, "rejected")
      .then(() => {
        alert("Property rejected!");
        onStatusChange();
      })
      .catch((err: unknown) => {
        console.log(err);
        alert("Error rejecting property");
      });
  }

  return (
    <>
      <div className="detail-overlay" onClick={onClose}></div>
      <div className="detail-panel">
        <div className="detail-header">
          <h2>Property Details</h2>
          <button className="detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <img
          className="detail-image"
          src={
            property.images && property.images.length > 0
              ? property.images[0]
              : "https://via.placeholder.com/400x240"
          }
          alt={property.title || "Property"}
        />

        <div className="detail-body">
          <div className="quick-info">
            <h3>Quick Info</h3>
            <div className="quick-info-item">
              📅 Submitted: {getTimeAgo(property.createdAt)}
            </div>
            <div className="quick-info-item">
              🏷️ Type: {property.propertyType || "N/A"}
            </div>
            <div className="quick-info-item">
              📌 Purpose: {property.purpose || "N/A"}
            </div>
            <div className="quick-info-item">
              📊 Status: {property.status}
            </div>
          </div>

          <h2 className="detail-title">{property.title || "Untitled"}</h2>
          <div className="detail-price">{formatPrice(property.price)}</div>
          <div className="detail-address">
            📍 {property.address || property.locality || property.city || "N/A"}
          </div>

          <div className="detail-specs">
            {property.bedrooms && (
              <div className="detail-spec">🛏️ {property.bedrooms} Beds</div>
            )}
            {property.bathrooms && (
              <div className="detail-spec">🚿 {property.bathrooms} Baths</div>
            )}
            {property.areaSize && (
              <div className="detail-spec">
                📐 {property.areaSize} {property.areaUnit}
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{property.description || "No description"}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="detail-section">
              <h3>Amenities</h3>
              <ul>
                {property.amenities.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {property.images && property.images.length > 1 && (
            <div className="detail-section">
              <h3>All Images ({property.images.length})</h3>
              <div className="image-grid">
                {property.images.map((img: string, i: number) => (
                  <img key={i} src={img} alt={`img-${i}`} />
                ))}
              </div>
            </div>
          )}

          {property.status === "pending" && (
            <div className="admin-actions">
              <h3>Admin Actions</h3>
              <div className="admin-actions-buttons">
                <button className="btn-action-approve" onClick={handleApprove}>
                  ✅ APPROVE
                </button>
                <button className="btn-action-reject" onClick={handleReject}>
                  ❌ REJECT
                </button>
              </div>
            </div>
          )}

          {property.status === "rejected" && (
            <div className="admin-actions">
              <button className="btn-action-approve" onClick={handleApprove}>
                ✅ APPROVE NOW
              </button>
            </div>
          )}

          {property.status === "approved" && (
            <div className="admin-actions">
              <button className="btn-action-reject" onClick={handleReject}>
                ❌ REJECT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;