import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../styles/HeroSection.module.css";
import image1 from "../assets/Screenshot 2026-05-18 010903.png";
import { useNavigate } from "react-router-dom";
import {
  PAKISTAN_LOCATIONS,
} from "../constants/pakistanLocations";

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
  "Room",
  "Penthouse",
];

/* ── Dynamic price ranges ── */
// Buy price options (PKR)
const BUY_PRICE_OPTIONS: { label: string; min?: number; max?: number }[] = [
  { label: "Any Price" },
  { label: "Under 10 Lac",          max: 1_000_000 },
  { label: "10 Lac – 25 Lac",       min: 1_000_000,  max: 2_500_000 },
  { label: "25 Lac – 50 Lac",       min: 2_500_000,  max: 5_000_000 },
  { label: "50 Lac – 1 Crore",      min: 5_000_000,  max: 10_000_000 },
  { label: "1 Crore – 2 Crore",     min: 10_000_000, max: 20_000_000 },
  { label: "2 Crore – 5 Crore",     min: 20_000_000, max: 50_000_000 },
  { label: "5 Crore – 10 Crore",    min: 50_000_000, max: 100_000_000 },
  { label: "10 Crore – 25 Crore",   min: 100_000_000,max: 250_000_000 },
  { label: "Above 25 Crore",        min: 250_000_000 },
];

// Rent price options (monthly PKR)
const RENT_PRICE_OPTIONS: { label: string; min?: number; max?: number }[] = [
  { label: "Any Rent" },
  { label: "Under 10,000",          max: 10_000 },
  { label: "10K – 20K",             min: 10_000,  max: 20_000 },
  { label: "20K – 40K",             min: 20_000,  max: 40_000 },
  { label: "40K – 75K",             min: 40_000,  max: 75_000 },
  { label: "75K – 1.5 Lac",         min: 75_000,  max: 150_000 },
  { label: "1.5 Lac – 3 Lac",       min: 150_000, max: 300_000 },
  { label: "3 Lac – 5 Lac",         min: 300_000, max: 500_000 },
  { label: "Above 5 Lac",           min: 500_000 },
];

const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab]           = useState<"buy" | "rent">("buy");
  const navigate                            = useNavigate();

  /* ── form states ── */
  const [locationInput,   setLocationInput]   = useState("");
  const [selectedCity,    setSelectedCity]    = useState("");
  const [selectedLocality,setSelectedLocality]= useState("");
  const [propertyType,    setPropertyType]    = useState("");
  const [priceRange,      setPriceRange]      = useState("-1"); // index into price options array

  /* ── dropdown open/close ── */
  const [showLocationDrop,  setShowLocationDrop]  = useState(false);
  const [showPropTypeDrop,  setShowPropTypeDrop]  = useState(false);

  /* ── refs for click-outside ── */
  const locationRef   = useRef<HTMLDivElement>(null);
  const propTypeRef   = useRef<HTMLDivElement>(null);

  /* ─────────────────────────────────────────────────
     Click outside → close dropdowns
  ───────────────────────────────────────────────── */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node))
        setShowLocationDrop(false);
      if (propTypeRef.current && !propTypeRef.current.contains(e.target as Node))
        setShowPropTypeDrop(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /* ─────────────────────────────────────────────────
     Filter location list based on typed input
  ───────────────────────────────────────────────── */
  const filteredLocations = useMemo(() => {
    const q = locationInput.toLowerCase().trim();

    if (!q) {
      /* show ALL cities with ALL their localities when nothing typed */
      return PAKISTAN_LOCATIONS.map((c) => ({
        city: c.name,
        localities: c.localities,
      }));
    }

    const results: Array<{ city: string; localities: string[] }> = [];

    PAKISTAN_LOCATIONS.forEach((cityData) => {
      const cityMatch = cityData.name.toLowerCase().includes(q);
      const matchLocs = cityData.localities.filter((l) =>
        l.toLowerCase().includes(q)
      );

      if (cityMatch) {
        /* show ALL localities when city matched */
        results.push({ city: cityData.name, localities: cityData.localities });
      } else if (matchLocs.length > 0) {
        /* show ALL matching localities */
        results.push({ city: cityData.name, localities: matchLocs });
      }
    });

    return results; // all matches, no cap
  }, [locationInput]);

  /* ─────────────────────────────────────────────────
     Filter property-type list based on typed input
  ───────────────────────────────────────────────── */
  const filteredTypes = useMemo(() => {
    const q = propertyType.trim().toLowerCase();
    if (!q) return PROPERTY_TYPES;
    return PROPERTY_TYPES.filter((t) => t.toLowerCase().includes(q));
  }, [propertyType]);

  /* ─────────────────────────────────────────────────
     Handlers
  ───────────────────────────────────────────────── */
  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedLocality("");
    setLocationInput(city);
    setShowLocationDrop(false);
  };

  const selectLocality = (city: string, loc: string) => {
    setSelectedCity(city);
    setSelectedLocality(loc);
    setLocationInput(`${loc}, ${city}`);
    setShowLocationDrop(false);
  };

  const selectType = (type: string) => {
    setPropertyType(type);
    setShowPropTypeDrop(false);
  };

  const clearLocation = () => {
    setLocationInput("");
    setSelectedCity("");
    setSelectedLocality("");
  };

  const clearType = () => setPropertyType("");

  /* ─────────────────────────────────────────────────
     Build query params & navigate
  ───────────────────────────────────────────────── */
  const handleSearch = () => {
    const params = new URLSearchParams();

    /* city / locality / free-text */
    if (selectedCity)    params.set("city",     selectedCity);
    if (selectedLocality)params.set("locality", selectedLocality);
    if (locationInput && !selectedCity)
      params.set("search", locationInput.trim());

    if (propertyType) params.set("propertyType", propertyType);

    /* price range — look up from the correct tab's options array */
    const idx = parseInt(priceRange, 10);
    if (idx >= 0) {
      const opts = activeTab === "buy" ? BUY_PRICE_OPTIONS : RENT_PRICE_OPTIONS;
      const chosen = opts[idx];
      if (chosen) {
        if (chosen.min !== undefined) params.set("minPrice", String(chosen.min));
        if (chosen.max !== undefined) params.set("maxPrice", String(chosen.max));
      }
    }

    const qs = params.toString();
    navigate(activeTab === "buy"
      ? `/buy${qs ? `?${qs}` : ""}`
      : `/rent${qs ? `?${qs}` : ""}`
    );
  };

  /* ─────────────────────────────────────────────────
     Highlight matching chars
  ───────────────────────────────────────────────── */
  const highlight = (text: string, query: string) => {
    if (!query.trim()) return text;
    const safe  = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${safe})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase()
        ? <span key={i} className={styles.highlight}>{p}</span>
        : p
    );
  };

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroInner} py-10`}>

        {/* ── Background image ── */}
        <div className={styles.heroImageContainer}>
          <img
            src={image1}
            alt="Modern architectural house"
            className={styles.heroImage}
          />
          <div className={styles.heroImageFade} />
        </div>

        {/* ── Headline + CTA ── */}
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            Find Your Dream Property with{" "}
            <span className={styles.brandName}>Zameen 360</span>
          </h1>
          <p className={styles.subHeadline}>
            Buy, sell or rent properties in the best locations across Pakistan.
            Verified listings, trusted properties.
          </p>

          <div className={`${styles.ctaButtons} py-4 gap-4 flex`}>
            <button
              className={`btn ${styles.btnPrimary}`}
              onClick={() => navigate(activeTab === "buy" ? "/buy" : "/rent")}
            >
              Explore Properties
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className={styles.arrowIcon}>
                <path d="M3.333 8h9.334M8.667 4l4 4-4 4"
                  stroke="#FFF" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* <button
              className={styles.btnSecondary}
              onClick={() => navigate("/post-property")}
            >
              Post Property
            </button> */}
          </div>
        </div>

        {/* ════════════════════ SEARCH BAR ════════════════════ */}
        <div className={styles.searchBarWrapper}>

          {/* Tabs */}
          <div className={styles.searchTabs}>
            {(["buy", "rent"] as const).map((tab) => (
              <button
                key={tab}
                className={`${styles.searchTab} ${activeTab === tab ? styles.searchTabActive : ""}`}
                onClick={() => { setActiveTab(tab); setPriceRange("-1"); }}
              >
                {tab === "buy" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>

          <div className={styles.searchBar}>

            {/* ── LOCATION ── */}
            <div className={styles.searchField} ref={locationRef}>
              <label className={styles.searchLabel}>Location</label>
              <div className={styles.searchInputWrapper}>
                {/* pin icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={styles.pinIcon}>
                  <path d="M8 8.667a2 2 0 100-4 2 2 0 000 4z"
                    stroke="#6B7280" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14.667S13.333 10.667 13.333 6.667a5.333 5.333 0 10-10.666 0c0 4 5.333 8 5.333 8z"
                    stroke="#6B7280" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <input
                  type="text"
                  placeholder="City, area or locality"
                  className={styles.searchInput}
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setSelectedCity("");
                    setSelectedLocality("");
                    setShowLocationDrop(true);
                  }}
                  onFocus={() => setShowLocationDrop(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {locationInput && (
                  <button className={styles.clearBtn} onClick={clearLocation}>×</button>
                )}
              </div>

              {/* ── Location dropdown ── */}
              {showLocationDrop && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownScroll}>
                    {filteredLocations.length === 0 ? (
                      <div className={styles.dropdownEmpty}>
                        No locations found for "{locationInput}"
                      </div>
                    ) : (
                      filteredLocations.map((item, i) => (
                        <div key={`${item.city}-${i}`} className={styles.dropdownGroup}>

                          {/* City row */}
                          <div
                            className={styles.dropdownCityItem}
                            onClick={() => selectCity(item.city)}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16"
                              fill="none" className={styles.dropdownIcon}>
                              <path d="M8 8.667a2 2 0 100-4 2 2 0 000 4z"
                                stroke="#2563eb" strokeWidth="1.2"/>
                              <path d="M8 14.667S13.333 10.667 13.333 6.667a5.333 5.333 0 10-10.666 0c0 4 5.333 8 5.333 8z"
                                stroke="#2563eb" strokeWidth="1.2"/>
                            </svg>
                            <div className={styles.dropdownCityText}>
                              <span className={styles.dropdownCityName}>
                                {highlight(item.city, locationInput)}
                              </span>
                              <span className={styles.dropdownCityLabel}>City</span>
                            </div>
                          </div>

                          {/* Locality rows */}
                          {item.localities.map((loc, li) => (
                            <div
                              key={`${loc}-${li}`}
                              className={styles.dropdownLocalityItem}
                              onClick={() => selectLocality(item.city, loc)}
                            >
                              <svg width="12" height="12" viewBox="0 0 16 16"
                                fill="none" className={styles.dropdownSubIcon}>
                                <path d="M6 12l4-4-4-4"
                                  stroke="#94a3b8" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className={styles.dropdownLocalityText}>
                                {highlight(loc, locationInput)}
                              </span>
                              <span className={styles.dropdownLocalityCity}>
                                {item.city}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.searchDivider} />

            {/* ── PROPERTY TYPE ── */}
            <div className={styles.searchField} ref={propTypeRef}>
              <label className={styles.searchLabel}>Property Type</label>
              <div className={styles.searchInputWrapper}>
                {/* home icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  className={styles.pinIcon}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    stroke="#6B7280" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10"
                    stroke="#6B7280" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <input
                  type="text"
                  placeholder="All property types"
                  className={styles.searchInput}
                  value={propertyType}
                  onChange={(e) => {
                    setPropertyType(e.target.value);
                    setShowPropTypeDrop(true);
                  }}
                  onFocus={() => setShowPropTypeDrop(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {propertyType && (
                  <button className={styles.clearBtn} onClick={clearType}>×</button>
                )}

                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={styles.chevronIcon}
                  style={{ pointerEvents: "auto", cursor: "pointer" }}
                  onClick={() => setShowPropTypeDrop((p) => !p)}>
                  <path d="M3.5 5.25L7 8.75l3.5-3.5"
                    stroke="#6B7280" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* ── Property-type dropdown ── */}
              {showPropTypeDrop && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownScroll}>
                    {filteredTypes.length === 0 ? (
                      <div className={styles.dropdownEmpty}>No type found</div>
                    ) : (
                      filteredTypes.map((type) => (
                        <div
                          key={type}
                          className={`${styles.dropdownTypeItem} ${
                            propertyType === type ? styles.dropdownTypeActive : ""
                          }`}
                          onClick={() => selectType(type)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24"
                            fill="none" className={styles.dropdownIcon}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              stroke={propertyType === type ? "#2563eb" : "#64748b"}
                              strokeWidth="1.5"/>
                            <path d="M9 22V12h6v10"
                              stroke={propertyType === type ? "#2563eb" : "#64748b"}
                              strokeWidth="1.5"/>
                          </svg>
                          <span>{highlight(type, propertyType)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.searchDivider} />

            {/* ── PRICE RANGE ── */}
            <div className={styles.searchField}>
              <label className={styles.searchLabel}>
                {activeTab === "buy" ? "Price Range" : "Rent Range"}
              </label>
              <div className={styles.searchSelectWrapper}>
                <select
                  className={styles.searchSelect}
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                  }}
                >
                  {(activeTab === "buy" ? BUY_PRICE_OPTIONS : RENT_PRICE_OPTIONS).map((o, idx) => (
                    <option key={idx} value={idx === 0 ? "-1" : String(idx)}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={styles.chevronIcon}>
                  <path d="M3.5 5.25L7 8.75l3.5-3.5"
                    stroke="#6B7280" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* ── SEARCH BUTTON ── */}
            <button className={styles.searchButton} onClick={handleSearch}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                className={styles.searchIcon}>
                <path d="M8.25 14.25a6 6 0 100-12 6 6 0 000 12zM15.75 15.75l-3.262-3.262"
                  stroke="#FFF" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Search Properties
            </button>
          </div>
        </div>
        {/* ════════════════════ END SEARCH BAR ════════════════════ */}

      </div>
    </section>
  );
};

export default HeroSection;