"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchFilters } from "@/types";

interface SearchBarProps {
  initialFilters?: Partial<SearchFilters>;
  onSearch?: (filters: SearchFilters) => void;
  inline?: boolean;
}

const PRICE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "PKR 50 Lac", value: "5000000" },
  { label: "PKR 1 Cr", value: "10000000" },
  { label: "PKR 2 Cr", value: "20000000" },
  { label: "PKR 5 Cr", value: "50000000" },
  { label: "PKR 10 Cr", value: "100000000" },
];

export default function SearchBar({
  initialFilters,
  onSearch,
  inline = false,
}: SearchBarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    location: initialFilters?.location ?? "",
    type: initialFilters?.type ?? "",
    purpose: initialFilters?.purpose ?? "",
    minPrice: initialFilters?.minPrice ?? "",
    maxPrice: initialFilters?.maxPrice ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    } else {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      router.push(`/properties?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl p-4 ${
        inline ? "" : "w-full max-w-4xl"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Location */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City or area..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Property Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Purpose
          </label>
          <select
            name="purpose"
            value={filters.purpose}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">Buy &amp; Rent</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Min Price
          </label>
          <select
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {PRICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Max Price
          </label>
          <select
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {PRICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 rounded-lg font-semibold text-white text-sm transition-colors"
          style={{ backgroundColor: "#059669" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#047857")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#059669")
          }
        >
          🔍 Search Properties
        </button>
      </div>
    </form>
  );
}
