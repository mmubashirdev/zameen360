"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Property, SearchFilters } from "@/types";

const ITEMS_PER_PAGE = 9;

type SortOption = "latest" | "price-asc" | "price-desc";

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") ?? "",
    type: searchParams.get("type") ?? "",
    purpose: searchParams.get("purpose") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  });
  const [sidebarType, setSidebarType] = useState<string>(
    searchParams.get("type") ?? ""
  );
  const [sidebarPurpose, setSidebarPurpose] = useState<string>(
    searchParams.get("purpose") ?? ""
  );
  const [sidebarBeds, setSidebarBeds] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result: Property[] = [...properties];

    const activeType = sidebarType || filters.type;
    const activePurpose = sidebarPurpose || filters.purpose;

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(loc) ||
          p.address.toLowerCase().includes(loc)
      );
    }
    if (activeType) result = result.filter((p) => p.type === activeType);
    if (activePurpose)
      result = result.filter((p) => p.purpose === activePurpose);
    if (filters.minPrice)
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice)
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    if (sidebarBeds)
      result = result.filter((p) => p.bedrooms >= Number(sidebarBeds));

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [filters, sidebarType, sidebarPurpose, sidebarBeds, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (f: SearchFilters) => {
    setFilters(f);
    setSidebarType(f.type);
    setSidebarPurpose(f.purpose);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div
        className="py-12 px-4 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #0f172a 70%)",
        }}
      >
        <h1 className="text-3xl font-extrabold mb-2">All Properties</h1>
        <p className="text-emerald-200 text-sm">
          Showing {filtered.length} properties across Pakistan
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 py-6 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <SearchBar initialFilters={filters} onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Filter By
              </h3>

              {/* Property Type */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Property Type
                </p>
                <div className="space-y-2">
                  {["", "House", "Apartment", "Commercial", "Plot"].map(
                    (t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sidebarType"
                          value={t}
                          checked={sidebarType === t}
                          onChange={() => {
                            setSidebarType(t);
                            setCurrentPage(1);
                          }}
                          className="accent-emerald-600"
                        />
                        <span className="text-sm text-gray-700">
                          {t || "All Types"}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Purpose
                </p>
                <div className="space-y-2">
                  {["", "Buy", "Rent"].map((p) => (
                    <label
                      key={p}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sidebarPurpose"
                        value={p}
                        checked={sidebarPurpose === p}
                        onChange={() => {
                          setSidebarPurpose(p);
                          setCurrentPage(1);
                        }}
                        className="accent-emerald-600"
                      />
                      <span className="text-sm text-gray-700">
                        {p || "All"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Min Bedrooms
                </p>
                <div className="space-y-2">
                  {["", "1", "2", "3", "4", "5"].map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sidebarBeds"
                        value={b}
                        checked={sidebarBeds === b}
                        onChange={() => {
                          setSidebarBeds(b);
                          setCurrentPage(1);
                        }}
                        className="accent-emerald-600"
                      />
                      <span className="text-sm text-gray-700">
                        {b || "Any"}
                        {b && "+"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSidebarType("");
                  setSidebarPurpose("");
                  setSidebarBeds("");
                  setFilters({
                    location: "",
                    type: "",
                    purpose: "",
                    minPrice: "",
                    maxPrice: "",
                  });
                  setCurrentPage(1);
                }}
                className="w-full py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort Row */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
                properties found
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="latest">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🏚</p>
                <p className="text-lg font-semibold text-gray-600">
                  No properties found
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === p
                          ? "text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      style={
                        currentPage === p
                          ? { backgroundColor: "#059669" }
                          : {}
                      }
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((c) => Math.min(totalPages, c + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
