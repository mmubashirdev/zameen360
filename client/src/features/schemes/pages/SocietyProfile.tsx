import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Heart, CheckCircle } from "lucide-react";
import DashboardNavbar from "../../marketplace/components/DashboardNavbar";
import styles from "../../marketplace/components/media/styles/Buy.module.css";
import axiosInstance from "@shared/lib/axios";

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

const SocietyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [society, setSociety] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        const response = await axiosInstance.get(`/schemes/public/${id}`);
        if (response.data?.success) {
          setSociety(response.data.society);
          setProperties(response.data.properties || []);
        }
      } catch (err) {
        console.error("Failed to fetch society profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSocietyData();
    }
  }, [id]);

  const formatPrice = (p: string | number) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const handleSeeMore = (propId: number) => navigate(`/property/${propId}`);

  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <main className={styles.main}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading society details...</div>
        ) : !society ? (
          <div className={styles.emptyState}>
            <p>Society not found</p>
            <small>This society may not exist or is pending approval.</small>
          </div>
        ) : (
          <>
            {/* Society Header */}
            <div style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "16px",
              marginBottom: "30px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#1e293b" }}>{society.societyName}</h1>
                <CheckCircle size={24} color="#16a34a" />
              </div>
              
              <div style={{ display: "flex", gap: "20px", color: "#64748b", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={18} />
                  <span>{society.address}, {society.areaSector}, {society.city}</span>
                </div>
                {society.website && (
                  <div>
                    <strong>Website:</strong> <a href={society.website.startsWith('http') ? society.website : `https://${society.website}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>{society.website}</a>
                  </div>
                )}
                {society.officialContact && (
                  <div>
                    <strong>Contact:</strong> {society.officialContact}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <div style={{ padding: "8px 16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <strong>Type:</strong> {society.societyType}
                </div>
                <div style={{ padding: "8px 16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <strong>NOC Status:</strong> {society.nocStatus}
                </div>
                {society.developerCompany && (
                  <div style={{ padding: "8px 16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <strong>Developer:</strong> {society.developerCompany}
                  </div>
                )}
              </div>
            </div>

            {/* Properties List */}
            <div className={styles.resultsHead}>
              <span>Available Properties in {society.societyName} ({properties.length})</span>
            </div>

            {properties.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No properties listed yet</p>
                <small>This society hasn't posted any available properties.</small>
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
                        {(p.amenities || []).slice(0, 3).map((a: string, i: number) => (
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
          </>
        )}
      </main>
    </div>
  );
};

export default SocietyProfile;
