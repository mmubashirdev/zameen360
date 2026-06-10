import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, MapPin, Bed, Bath, Maximize, Heart,
  SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DashboardNavbar from "../components/DashboardNavbar";
// ✅ AFTER
import { useSocket } from "../components/hooks/usehook";
import type { PropertyEventData } from "../components/hooks/usehook";
import styles from "../../marketplace/components/media/styles/Buy.module.css";

interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  status: string;
}

interface StoredUser {
  id: number;
  fullName?: string;
  email?: string;
}

const Buy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // ── Get user from localStorage with proper typing ─────────────────
  const storedUser = localStorage.getItem("user");
  const currentUser: StoredUser | null = storedUser
    ? (JSON.parse(storedUser) as StoredUser)
    : null;

  // Filter states
  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [minBaths, setMinBaths] = useState("");
  const [maxBaths, setMaxBaths] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [sections, setSections] = useState({
    purpose: true, type: true, location: true,
    price: true, beds: true, baths: true,
    area: true, amenities: false,
  });

  const toggleSection = (key: keyof typeof sections) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const amenitiesList = [
    "Parking", "Swimming Pool", "Garden", "Gym",
    "Elevator", "Security", "CCTV", "Balcony",
    "Central AC", "Servant Quarter", "Solar Panels", "Furnished",
  ];

  const toggleAmenity = (amenity: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );

  // ── WebSocket — Live properties ───────────────────────────────────
  const { on } = useSocket({
    userId: currentUser?.id,
    joinPublic: true,
  });

  useEffect(() => {
    // ✅ Properly typed callback
    const handleApproved = (data: PropertyEventData) => {
      if (!data.property) return;
      const newProperty = data.property as Property;

      // Skip Rent properties — Buy page only shows Sell/Lease
      if (newProperty.purpose?.toLowerCase() === "rent") return;

      setProperties((prev) => {
        if (prev.find((p) => p.id === newProperty.id)) return prev;
        return [newProperty, ...prev];
      });

      toast.success(`🏠 New property: ${newProperty.title || "New listing"}`, {
        duration: 5000,
        position: "top-right",
      });
    };

    const handleDeleted = (data: PropertyEventData) => {
      if (!data.propertyId) return;
      setProperties((prev) => prev.filter((p) => p.id !== data.propertyId));
    };

    const unsub1 = on("property_approved", handleApproved);
    const unsub2 = on("property_deleted", handleDeleted);

    return () => {
      unsub1();
      unsub2();
    };
  }, [on]);

  // ── Read URL params on mount ──────────────────────────────────────
  useEffect(() => {
    const urlCity = searchParams.get("city");
    const urlSearch = searchParams.get("search");
    const urlPropertyType = searchParams.get("propertyType");
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlLocality = searchParams.get("locality");

    if (urlCity) setCity(urlCity);
    if (urlSearch) setSearch(urlSearch);
    if (urlPropertyType) setPropertyType(urlPropertyType);
    if (urlMinPrice) setMinPrice(urlMinPrice);
    if (urlMaxPrice) setMaxPrice(urlMaxPrice);
    if (urlLocality && !urlSearch) setSearch(urlLocality);

    // Defer so React batches state updates before fetch runs
    setTimeout(() => setInitialLoad(false), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("purpose", purpose || "Sell");
      if (propertyType) params.append("propertyType", propertyType);
      if (city) params.append("city", city);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (minBeds) params.append("minBeds", minBeds);
      if (maxBeds) params.append("maxBeds", maxBeds);
      if (minBaths) params.append("minBaths", minBaths);
      if (maxBaths) params.append("maxBaths", maxBaths);
      if (minArea) params.append("minArea", minArea);
      if (maxArea) params.append("maxArea", maxArea);
      if (areaUnit) params.append("areaUnit", areaUnit);
      if (selectedAmenities.length > 0)
        params.append("amenities", selectedAmenities.join(","));

      const res = await fetch(`http://localhost:5000/api/properties?${params}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setProperties(result.data);
      } else if (Array.isArray(result)) {
        setProperties(result);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProperties([]);
    }
  }, [
    search, purpose, propertyType, city,
    minPrice, maxPrice, minBeds, maxBeds,
    minBaths, maxBaths, minArea, maxArea,
    areaUnit, selectedAmenities,
  ]);

  useEffect(() => {
    if (!initialLoad) {
      setLoading(true);
      fetchProperties().finally(() => setLoading(false));
    }
  }, [fetchProperties, initialLoad]);

  const handleReset = () => {
    setSearch(""); setPurpose(""); setPropertyType("");
    setCity(""); setMinPrice(""); setMaxPrice("");
    setMinBeds(""); setMaxBeds(""); setMinBaths("");
    setMaxBaths(""); setMinArea(""); setMaxArea("");
    setAreaUnit(""); setSelectedAmenities([]);
    navigate("/buy", { replace: true });
    setTimeout(fetchProperties, 0);
  };

  const activeFilterCount = [
    purpose, propertyType, city, minPrice, maxPrice,
    minBeds, maxBeds, minBaths, maxBaths,
    minArea, maxArea, areaUnit, ...selectedAmenities,
  ].filter(Boolean).length;

  const formatPrice = (p: string | number) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const handleSeeMore = (id: number) => navigate(`/property/${id}`);

  return (
    <div className={styles.page}>
      <Toaster />
      <DashboardNavbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Find Your Dream Property</h1>
          <p>Browse thousands of verified listings</p>
        </div>

        <div
          className={`${styles.mobileOverlay} ${sidebarOpen ? styles.mobileOverlayShow : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className={styles.layoutWrapper}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarHeaderLeft}>
                <SlidersHorizontal size={17} color="#2563eb" />
                <h3>Filters</h3>
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
              </div>
              <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(false)}>
                <X size={17} />
              </button>
            </div>

            <div className={styles.sidebarBody}>
              {/* Purpose */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("purpose")}>
                  <h4>Purpose</h4>
                  {sections.purpose ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.purpose && (
                  <div className={styles.sectionContent}>
                    <select className={styles.filterSelect} value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}>
                      <option value="">All Purposes</option>
                      <option value="Sell">For Sell</option>
                      <option value="Lease">Lease</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Property Type */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("type")}>
                  <h4>Property Type</h4>
                  {sections.type ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.type && (
                  <div className={styles.sectionContent}>
                    <select className={styles.filterSelect} value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="">All Types</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Plot / Land">Plot / Land</option>
                      <option value="Villa">Villa</option>
                      <option value="Shop">Shop</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Agricultural">Agricultural</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("location")}>
                  <h4>Location</h4>
                  {sections.location ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.location && (
                  <div className={styles.sectionContent}>
                    <input className={styles.filterInput} type="text"
                      placeholder="Enter city name..." value={city}
                      onChange={(e) => setCity(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("price")}>
                  <h4>Price Range (PKR)</h4>
                  {sections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.price && (
                  <div className={styles.sectionContent}>
                    <div className={styles.rangeRow}>
                      <input className={styles.filterInput} type="number"
                        placeholder="Min" value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)} />
                      <span>to</span>
                      <input className={styles.filterInput} type="number"
                        placeholder="Max" value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Beds */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("beds")}>
                  <h4>Bedrooms</h4>
                  {sections.beds ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.beds && (
                  <div className={styles.sectionContent}>
                    <label className={styles.filterLabel}>Minimum Beds</label>
                    <div className={styles.quickSelect}>
                      {["", "1", "2", "3", "4", "5", "6+"].map((val) => (
                        <button key={`minbed-${val}`}
                          className={`${styles.quickBtn} ${minBeds === val ? styles.quickBtnActive : ""}`}
                          onClick={() => setMinBeds(val)}>
                          {val || "Any"}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <label className={styles.filterLabel}>Maximum Beds</label>
                      <div className={styles.quickSelect}>
                        {["", "1", "2", "3", "4", "5", "6+"].map((val) => (
                          <button key={`maxbed-${val}`}
                            className={`${styles.quickBtn} ${maxBeds === val ? styles.quickBtnActive : ""}`}
                            onClick={() => setMaxBeds(val)}>
                            {val || "Any"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Baths */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("baths")}>
                  <h4>Bathrooms</h4>
                  {sections.baths ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.baths && (
                  <div className={styles.sectionContent}>
                    <label className={styles.filterLabel}>Minimum Baths</label>
                    <div className={styles.quickSelect}>
                      {["", "1", "2", "3", "4", "5"].map((val) => (
                        <button key={`minbath-${val}`}
                          className={`${styles.quickBtn} ${minBaths === val ? styles.quickBtnActive : ""}`}
                          onClick={() => setMinBaths(val)}>
                          {val || "Any"}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <label className={styles.filterLabel}>Maximum Baths</label>
                      <div className={styles.quickSelect}>
                        {["", "1", "2", "3", "4", "5"].map((val) => (
                          <button key={`maxbath-${val}`}
                            className={`${styles.quickBtn} ${maxBaths === val ? styles.quickBtnActive : ""}`}
                            onClick={() => setMaxBaths(val)}>
                            {val || "Any"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Area */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("area")}>
                  <h4>Area Size</h4>
                  {sections.area ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.area && (
                  <div className={styles.sectionContent}>
                    <select className={styles.filterSelect} value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value)}
                      style={{ marginBottom: 8 }}>
                      <option value="">Any Unit</option>
                      <option value="Marla">Marla</option>
                      <option value="Kanal">Kanal</option>
                      <option value="Sq. Ft.">Sq. Ft.</option>
                      <option value="Sq. Yd.">Sq. Yd.</option>
                      <option value="Sq. M.">Sq. M.</option>
                    </select>
                    <div className={styles.rangeRow}>
                      <input className={styles.filterInput} type="number"
                        placeholder="Min" value={minArea}
                        onChange={(e) => setMinArea(e.target.value)} />
                      <span>to</span>
                      <input className={styles.filterInput} type="number"
                        placeholder="Max" value={maxArea}
                        onChange={(e) => setMaxArea(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader} onClick={() => toggleSection("amenities")}>
                  <h4>Amenities</h4>
                  {sections.amenities ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {sections.amenities && (
                  <div className={styles.sectionContent}>
                    <div className={styles.amenityGrid}>
                      {amenitiesList.map((amenity) => (
                        <span key={amenity}
                          className={`${styles.amenityChip} ${selectedAmenities.includes(amenity) ? styles.amenityChipActive : ""}`}
                          onClick={() => toggleAmenity(amenity)}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sidebarActions}>
              <button className={styles.applyBtn}
                onClick={() => { fetchProperties(); setSidebarOpen(false); }}>
                <Search size={14} /> Apply Filters
              </button>
              <button className={styles.resetBtn} onClick={handleReset}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className={styles.contentArea}>
            <div className={styles.topSearchBar}>
              <button className={styles.mobileFilterToggle}
                onClick={() => setSidebarOpen(true)}>
                <SlidersHorizontal size={15} /> Filters
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
              </button>
              <Search size={17} color="#94a3b8" />
              <input type="text"
                placeholder="Search by title, city, or description..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProperties()} />
              <button className={styles.searchBtn} onClick={fetchProperties}>
                <Search size={14} /> Search
              </button>
            </div>

            <div className={styles.resultsHead}>
              <span>
                {loading ? "Searching..." : `${properties.length} Properties Found`}
              </span>
              <div className={styles.activeFilters}>
                {purpose && (
                  <span className={styles.activeFilterTag} onClick={() => setPurpose("")}>
                    {purpose} <X size={10} />
                  </span>
                )}
                {propertyType && (
                  <span className={styles.activeFilterTag} onClick={() => setPropertyType("")}>
                    {propertyType} <X size={10} />
                  </span>
                )}
                {city && (
                  <span className={styles.activeFilterTag} onClick={() => setCity("")}>
                    {city} <X size={10} />
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className={styles.activeFilterTag}
                    onClick={() => { setMinPrice(""); setMaxPrice(""); }}>
                    Price: {minPrice || "0"} – {maxPrice || "∞"} <X size={10} />
                  </span>
                )}
                {(minBeds || maxBeds) && (
                  <span className={styles.activeFilterTag}
                    onClick={() => { setMinBeds(""); setMaxBeds(""); }}>
                    Beds: {minBeds || "0"}–{maxBeds || "∞"} <X size={10} />
                  </span>
                )}
                {(minBaths || maxBaths) && (
                  <span className={styles.activeFilterTag}
                    onClick={() => { setMinBaths(""); setMaxBaths(""); }}>
                    Baths: {minBaths || "0"}–{maxBaths || "∞"} <X size={10} />
                  </span>
                )}
                {selectedAmenities.map((a) => (
                  <span key={a} className={styles.activeFilterTag}
                    onClick={() => toggleAmenity(a)}>
                    {a} <X size={10} />
                  </span>
                ))}
              </div>
            </div>

            {loading ? (
              <div className={styles.skeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonBody}>
                      <div className={`${styles.skeletonLine} ${styles.skeletonW80} ${styles.skeletonH20}`} />
                      <div className={`${styles.skeletonLine} ${styles.skeletonW60}`} />
                      <div className={`${styles.skeletonLine} ${styles.skeletonW40} ${styles.skeletonH20}`} />
                      <div className={`${styles.skeletonLine} ${styles.skeletonW80}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No properties found</p>
                <small>Try adjusting your filters or post your first property!</small>
              </div>
            ) : (
              <div className={styles.grid}>
                {properties.map((p) => (
                  <div key={p.id} className={styles.card} onClick={() => handleSeeMore(p.id)}>
                    <div className={styles.imageWrap}>
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"}
                        alt={p.title} />
                      <span className={styles.tag}>For {p.purpose}</span>
                      <Heart className={styles.heart} size={18}
                        onClick={(e) => e.stopPropagation()} />
                    </div>
                    <div className={styles.cardBody}>
                      <h4 className={styles.propTitle}>{p.title}</h4>
                      <div className={styles.location}>
                        <MapPin size={13} /> {p.locality}, {p.city}
                      </div>
                      <div className={styles.price}>PKR {formatPrice(p.price)}</div>
                      <div className={styles.specs}>
                        <div><Bed size={15} /><span>{p.bedrooms} Beds</span></div>
                        <div><Bath size={15} /><span>{p.bathrooms} Baths</span></div>
                        <div><Maximize size={15} /><span>{p.areaSize} {p.areaUnit}</span></div>
                      </div>
                      <div className={styles.chips}>
                        {(p.amenities || []).slice(0, 3).map((a, i) => (
                          <span key={i}>{a}</span>
                        ))}
                        {(p.amenities || []).length > 3 && (
                          <span className={styles.more}>+{p.amenities.length - 3} more</span>
                        )}
                      </div>
                      <button className={styles.seeMoreBtn}
                        onClick={(e) => { e.stopPropagation(); handleSeeMore(p.id); }}>
                        See More Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Buy;