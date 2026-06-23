import { useState, useEffect } from "react";
import { Search, MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../../marketplace/components/media/styles/Buy.module.css";
import axiosInstance from "@shared/lib/axios";

const Schemes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axiosInstance.get("/schemes/public");
        if (response.data?.success) {
          setSocieties(response.data.societies || []);
        }
      } catch (err) {
        console.error("Failed to fetch societies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  const filteredSocieties = societies.filter(soc =>
    soc.societyName?.toLowerCase().includes(search.toLowerCase()) ||
    soc.city?.toLowerCase().includes(search.toLowerCase()) ||
    soc.areaSector?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (p: string | number) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1>Explore Society Schemes</h1>
            <p>Find your ideal plot or commercial space</p>
          </div>
          <button
            onClick={() => navigate("/verify-society")}
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Verify Your Housing Society
          </button>
        </div>

        <div className={styles.layoutWrapper}>
          <div className={styles.contentArea}>
            <div className={styles.topSearchBar}>
              <Search size={17} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by scheme name or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className={styles.resultsHead}>
              <span>Verified Societies ({filteredSocieties.length})</span>
            </div>

            {loading ? (
              <p>Loading societies...</p>
            ) : filteredSocieties.length > 0 ? (
              <div style={{ marginTop: "20px" }}>
                {filteredSocieties.map((soc) => (
                  <div key={soc.id} style={{ marginBottom: "40px" }}>
                    <div
                      onClick={() => navigate(`/societies/${soc.id}`)}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        marginBottom: "20px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    >
                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem", color: "#1e293b" }}>{soc.societyName}</h3>
                      <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.9rem" }}>
                        <strong>City:</strong> {soc.city}
                      </p>
                      <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.9rem" }}>
                        <strong>Sector:</strong> {soc.areaSector}
                      </p>
                      <div style={{ marginTop: "15px", display: "inline-block", padding: "4px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                        NOC: {soc.nocStatus}
                      </div>
                    </div>

                    {/* Properties of this society */}
                    {soc.properties && soc.properties.length > 0 && (
                      <div style={{ paddingLeft: "20px", borderLeft: "4px solid #e2e8f0" }}>
                        <h4 style={{ marginBottom: "15px", color: "#475569" }}>Properties in {soc.societyName}</h4>
                        <div className={styles.grid}>
                          {soc.properties.map((p: any) => (
                            <div key={p.id} className={styles.card} onClick={() => navigate(`/property/${p.id}`)}>
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
                                  {(p.amenities || []).slice(0, 3).map((a: string, i: number) => (
                                    <span key={i}>{a}</span>
                                  ))}
                                  {(p.amenities || []).length > 3 && (
                                    <span className={styles.more}>+{p.amenities.length - 3} more</span>
                                  )}
                                </div>
                                <button className={styles.seeMoreBtn}
                                  onClick={(e) => { e.stopPropagation(); navigate(`/property/${p.id}`); }}>
                                  See More Details →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No societies found</p>
                <small>Try adjusting your search criteria.</small>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schemes;
