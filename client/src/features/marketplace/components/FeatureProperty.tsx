// FeaturedProperties.tsx
import { useState, useEffect, useRef } from "react";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "../styles/FeatureProperty.module.css";
import {
  API_BASE_URL,
  NGROK_SKIP_BROWSER_WARNING_HEADER,
} from "@shared/config/api";

const BASE_URL = API_BASE_URL;
const AUTO_SLIDE_INTERVAL = 4000; // ⭐ 4 seconds per slide

interface Property {
  id: number;
  title: string | null;
  description: string | null;
  purpose: string | null;
  propertyType: string | null;
  price: string | null;
  monthlyRent: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  areaSize: string | null;
  areaUnit: string | null;
  city: string | null;
  locality: string | null;
  address: string | null;
  images: string[];
  status: string;
  isFeatured?: boolean;
  featuredUntil?: string | null;
  createdAt: string;
}

// ⭐ Format price - ESLint warning fix (direct return)
const formatPrice = (
  price: string | null,
  purpose: string | null,
  rent: string | null,
): string => {
  const isRent = purpose?.toLowerCase() === "rent";
  const value = isRent ? rent : price;

  if (!value) return "Price on Request";

  const num = Number(value);

  if (num >= 10000000) {
    return isRent
      ? `PKR ${(num / 10000000).toFixed(2)} Cr/mo`
      : `PKR ${(num / 10000000).toFixed(2)} Cr`;
  }

  if (num >= 100000) {
    return isRent
      ? `PKR ${(num / 100000).toFixed(2)} Lac/mo`
      : `PKR ${(num / 100000).toFixed(2)} Lac`;
  }

  return isRent
    ? `PKR ${num.toLocaleString()}/mo`
    : `PKR ${num.toLocaleString()}`;
};

function FeaturedProperties() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false); // ⭐ Pause on hover
  const [now, setNow] = useState(() => new Date().getTime());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, properties.length - itemsPerPage);

  // ⭐ Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/properties?status=approved`, {
          headers: NGROK_SKIP_BROWSER_WARNING_HEADER,
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Failed to fetch");

        if (result.success && Array.isArray(result.data)) {
          setProperties(result.data.slice(0, 12));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ⭐ AUTO-ROTATE CAROUSEL (like video slider)
  useEffect(() => {
    // Don't auto-rotate if paused, loading, or not enough items
    if (isPaused || loading || properties.length <= itemsPerPage) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL);

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, loading, properties.length, maxIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date().getTime());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  // ⭐ Jump to specific slide (dots indicator)
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const navigateToPropertyDetails = (id: number) => {
    navigate(`/property/${id}`);
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Featured <span>Properties</span>
            </h2>
            <p className={styles.subtitle}>
              Handpicked properties just for you
            </p>
          </div>
          <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 calc(25% - 15px)",
                  background: "#f3f4f6",
                  borderRadius: "12px",
                  height: "400px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ==================== ERROR / EMPTY STATE ====================
  if (error || properties.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Featured <span>Properties</span>
            </h2>
            <p className={styles.subtitle}>
              Handpicked properties just for you
            </p>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#f9fafb",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏠</div>
            <h3
              style={{
                fontSize: "18px",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              {error
                ? "Couldn't load properties"
                : "No properties available yet"}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              {error || "Check back soon for new listings!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const showArrows = properties.length > itemsPerPage;
  const totalSlides = maxIndex + 1; // Number of dots

  // ==================== MAIN RENDER ====================
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Featured <span>Properties</span>
          </h2>
          <p className={styles.subtitle}>Handpicked properties just for you</p>
        </div>

        {/* ⭐ Pause on hover */}
        <div
          className={styles.carouselWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {showArrows && (
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={prevSlide}
              aria-label="Previous"
            >
              &#8249;
            </button>
          )}

          <div className={styles.carouselViewport}>
            <div
              className={styles.cardContainer}
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                transition: "transform 0.6s ease-in-out", // ⭐ Smooth animation
              }}
            >
              {properties.map((property) => {
                const isRent = property.purpose?.toLowerCase() === "rent";
                const statusLabel = isRent ? "For Rent" : "For Sale";
                const featuredUntil = property.featuredUntil
                  ? new Date(property.featuredUntil).getTime()
                  : null;
                const isFeatured = Boolean(
                  (property.isFeatured || featuredUntil) &&
                    (!featuredUntil || featuredUntil > now),
                );
                const location =
                  [property.locality, property.city]
                    .filter(Boolean)
                    .join(", ") || "Location not specified";

                return (
                  <div className={styles.card} key={property.id}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={
                          property.images?.[0] ||
                          "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={property.title || "Property"}
                        className={styles.cardImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <span
                        className={`${styles.badge} ${
                          isRent ? styles.badgeRent : styles.badgeSale
                        }`}
                      >
                        {statusLabel}
                      </span>
                      {isFeatured && (
                        <span className={styles.featuredBadge}>Featured</span>
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>
                        {property.title || "Untitled Property"}
                      </h3>
                      <p className={styles.cardLocation}>
                        <MdLocationOn size={20} color="#ff4d4d" />
                        {location}
                      </p>
                      <p className={styles.cardPrice}>
                        {formatPrice(
                          property.price,
                          property.purpose,
                          property.monthlyRent,
                        )}
                      </p>
                      <div className={styles.features}>
                        <span>{property.bedrooms || "—"} Beds</span>
                        <span className={styles.divider}></span>
                        <span>{property.bathrooms || "—"} Baths</span>
                        <span className={styles.divider}></span>
                        <span>
                          {property.areaSize
                            ? `${property.areaSize} ${property.areaUnit || ""}`
                            : "—"}
                        </span>
                      </div>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => navigateToPropertyDetails(property.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {showArrows && (
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={nextSlide}
              aria-label="Next"
            >
              &#8250;
            </button>
          )}
        </div>

        {/* ⭐ Dots Indicator */}
        {showArrows && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "24px",
            }}
          >
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  border: "none",
                  background: idx === currentIndex ? "#2563eb" : "#d1d5db",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
