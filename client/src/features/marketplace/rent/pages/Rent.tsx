// client/src/features/marketplace/rent/pages/Rent.tsx
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import RentFilterBar from "../components/RentFilterBar";
import RentPropertyCard from "../components/RentPropertyCard";
import RentEmptyState from "../components/RentEmptyState";
import { useRentProperties } from "../hooks/useRentProperties";
import styles from "../../components/media/styles/Buy.module.css";

const RentPage = () => {
  const navigate = useNavigate();
  const {
    properties,
    loading,
    error,
    total,
    filters,
    updateFilter,
    resetFilters,
    refetch,
  } = useRentProperties();

  const hasActiveFilters =
    !!filters.search ||
    !!filters.propertyType ||
    !!filters.city ||
    !!filters.minPrice ||
    !!filters.maxPrice;

  return (
    <div className={styles.page}>
      <DashboardNavbar />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Find Your Perfect Rental</h1>
          <p>Browse verified rental properties across Pakistan</p>
        </div>

        {/* Filter Bar */}
        <RentFilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onSearch={refetch}
          onReset={resetFilters}
        />

        {/* Results Count */}
        <div className={styles.resultsHead}>
          <span>
            {loading
              ? "Searching..."
              : `${total} Rental ${total === 1 ? "Property" : "Properties"} Found`}
          </span>
          {hasActiveFilters && (
            <button
              className={styles.resetBtn}
              onClick={resetFilters}
              style={{ marginLeft: 12 }}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#dc2626",
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            ⚠️ {error} —{" "}
            <button
              onClick={refetch}
              style={{
                color: "#dc2626",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#f3f4f6",
                  borderRadius: 12,
                  height: 320,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className={styles.grid}>
            {properties.map((property) => (
              <RentPropertyCard
                key={property.id}
                property={property}
                onSeeMore={(id) => navigate(`/property/${id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <RentEmptyState
            hasFilters={hasActiveFilters}
            onReset={resetFilters}
          />
        )}
      </main>
    </div>
  );
};

export default RentPage;
