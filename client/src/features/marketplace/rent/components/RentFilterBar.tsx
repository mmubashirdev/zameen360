// client/src/features/marketplace/rent/components/RentFilterBar.tsx
import { Search } from "lucide-react";
import type { RentFilters } from "../api/rentApi";
import styles from "../../components/media/styles/Buy.module.css";

interface RentFilterBarProps {
  filters: RentFilters;
  onFilterChange: <K extends keyof RentFilters>(
    key: K,
    value: RentFilters[K],
  ) => void;
  onSearch: () => void;
  onReset: () => void;
}

const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Commercial",
  "Plot / Land",
  "Villa",
  "Shop",
  "Office",
  "Warehouse",
  "Agricultural",
];

const RentFilterBar = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
}: RentFilterBarProps) => {
  return (
    <div className={styles.filterBar}>
      {/* Search */}
      <div className={styles.searchBox}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Search by title, city or description..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      {/* Property Type */}
      <select
        value={filters.propertyType}
        onChange={(e) => onFilterChange("propertyType", e.target.value)}
      >
        <option value="">All Types</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* City */}
      <input
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={(e) => onFilterChange("city", e.target.value)}
      />

      {/* Min Price */}
      <input
        type="number"
        placeholder="Min Rent (PKR)"
        value={filters.minPrice}
        onChange={(e) => onFilterChange("minPrice", e.target.value)}
      />

      {/* Max Price */}
      <input
        type="number"
        placeholder="Max Rent (PKR)"
        value={filters.maxPrice}
        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
      />

      <button className={styles.searchBtn} onClick={onSearch}>
        Search
      </button>

      <button className={styles.resetBtn} onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

export default RentFilterBar;
