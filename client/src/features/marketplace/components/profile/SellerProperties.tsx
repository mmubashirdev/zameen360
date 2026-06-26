import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Heart, Star } from "lucide-react";
import { getMyListings } from "../../../../api/seller.api";
import FeaturePropertyModal from "../../components/FeaturePropertyModal";
import styles from "../media/styles/Buy.module.css";

// ✅ Extended interface — isFeatured & featuredUntil added
// These must also be returned by your getMyListings API response
interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  areaSize: string | number;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  status: string;
  isFeatured: boolean;
  featuredUntil: string | null;
}

// ✅ Typed modal state — null means modal is closed
// Using a dedicated type instead of two separate booleans keeps
// modal state atomic — you can never have id without title
interface FeatureModalState {
  id: number;
  title: string;
}

const SellerProperties: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Single piece of state controls the modal
  // null = closed, object = open with that property's context
  const [featureModal, setFeatureModal] = useState<FeatureModalState | null>(
    null,
  );

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyListings({ limit: 100 });
        const propertyList = data?.listings || [];

        // ⚠️ Filter is case-sensitive — make sure your API returns
        // 'approved' lowercase consistently, or normalize here:
        // p.status.toLowerCase() === 'approved'
        const approvedOnly = propertyList.filter(
          (p: Property) => p.status.toLowerCase() === "approved",
        );

        setProperties(Array.isArray(approvedOnly) ? approvedOnly : []);
      } catch (err) {
        console.error("❌ Error fetching seller properties:", err);
        setError("Failed to load properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  // ✅ Local state update after successful payment
  // WHY: Avoids a full re-fetch just to reflect one field change.
  // The modal tells us exactly what changed, so we surgically update
  // only that property in the list — O(n) map, no network cost.
  const handleFeatureSuccess = (propertyId: number, featuredUntil: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFeatured: true, featuredUntil } : p,
      ),
    );
    setFeatureModal(null);
  };

  const formatPrice = (p: string | number) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const handleSeeMore = (id: number) => navigate(`/property/${id}`);

  // ✅ Guard against expired featured status
  // WHY: isFeatured=true in DB doesn't mean it's still active.
  // A cron job may not have cleaned it up yet. Always derive
  // display state from the date, not just the boolean.
  const isStillFeatured = (property: Property): boolean => {
    return (
      property.isFeatured &&
      !!property.featuredUntil &&
      new Date(property.featuredUntil) > new Date()
    );
  };

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Published Properties
        </h2>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonBody}>
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonW80} ${styles.skeletonH20}`}
                />
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonW60}`}
                />
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonW40} ${styles.skeletonH20}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ width: "100%" }}
        className="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div style={{ width: "100%" }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Published Properties
        </h2>
        <div className={styles.emptyState}>
          <p>No published properties yet</p>
          <small>Post your first property to get started!</small>
        </div>
      </div>
    );
  }

  return (
    // ✅ Fragment wraps the grid + modal
    // WHY: Modal must live OUTSIDE the card grid's overflow context.
    // If you rendered it inside the .card div, the card's
    // overflow:hidden would clip the modal. Sibling placement fixes this.
    <>
      <div style={{ width: "100%" }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Published Properties ({properties.length})
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "18px",
            maxWidth: "100%",
          }}
        >
          {properties.map((p) => (
            <div
              key={p.id}
              className={styles.card}
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => handleSeeMore(p.id)}
            >
              {/* ✅ Featured badge on the image */}
              {isStillFeatured(p) && (
                <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} fill="white" />
                  Featured
                </div>
              )}

              <div
                className={styles.imageWrap}
                style={{
                  height: "180px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={
                    p.images?.[0] ||
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
                  }
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className={styles.tag}>For {p.purpose}</span>
                <Heart
                  className={styles.heart}
                  size={18}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className={styles.cardBody}>
                <h4 className={styles.propTitle}>{p.title}</h4>
                <div className={styles.location}>
                  <MapPin size={13} /> {p.locality}, {p.city}
                </div>
                <div className={styles.price}>PKR {formatPrice(p.price)}</div>
                <div className={styles.specs}>
                  <div>
                    <Bed size={15} />
                    <span>{p.bedrooms} Beds</span>
                  </div>
                  <div>
                    <Bath size={15} />
                    <span>{p.bathrooms} Baths</span>
                  </div>
                  <div>
                    <Maximize size={15} />
                    <span>
                      {p.areaSize} {p.areaUnit}
                    </span>
                  </div>
                </div>
                <div className={styles.chips}>
                  {(p.amenities || []).slice(0, 3).map((a, i) => (
                    <span key={i}>{a}</span>
                  ))}
                  {(p.amenities || []).length > 3 && (
                    <span className={styles.more}>
                      +{p.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* ✅ Feature section — sits above "See More" button */}
                <div
                  className="mt-3"
                  // ✅ Critical: stops card's onClick from firing when
                  // user interacts with the feature area
                  onClick={(e) => e.stopPropagation()}
                >
                  {isStillFeatured(p) ? (
                    // Show expiry info when already featured
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-amber-700 flex items-center gap-1">
                      ⭐ Featured until{" "}
                      {p.featuredUntil
                        ? new Date(p.featuredUntil).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </div>
                  ) : (
                    // Show Feature button when not featured (or expired)
                    <button
                      onClick={() =>
                        setFeatureModal({ id: p.id, title: p.title })
                      }
                      className="w-full px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 
                                 hover:from-amber-600 hover:to-orange-600 text-white text-sm 
                                 font-semibold rounded-lg flex items-center justify-center gap-2 
                                 transition-all duration-200"
                    >
                      <Star size={14} />
                      Feature This Property
                    </button>
                  )}
                </div>

                <button
                  className={styles.seeMoreBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeeMore(p.id);
                  }}
                >
                  See More Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Modal rendered outside the grid — clean z-index stacking */}
      {featureModal && (
        <FeaturePropertyModal
          propertyId={featureModal.id}
          propertyTitle={featureModal.title}
          onClose={() => setFeatureModal(null)}
          onSuccess={handleFeatureSuccess}
        />
      )}
    </>
  );
};

export default SellerProperties;
