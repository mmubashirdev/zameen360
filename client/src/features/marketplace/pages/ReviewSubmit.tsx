// client/src/features/marketplace/pages/ReviewSubmit.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Rocket, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useProperty } from "../components/context/useProperty";
import { useAuthContext } from "../../auth/context/useAuthContext";
import type { PropertyData } from "../components/context/PropertyContext";
import styles from "../components/media/styles/ReviewSubmit.module.css";
import Map from "../components/media/Map";
import { reverseGeocodeLatLng } from "../utils/geocoding";

// ⭐ Props for step navigation (from CreatePropertyPost)
interface ReviewSubmitProps {
  onBack?: () => void;
  onEditStep?: (step: number) => void;
}

interface SectionProps {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}

const Section = ({ title, onEdit, children }: SectionProps) => (
  <div className={styles.card}>
    <div className={styles.cardHead}>
      <h3>{title}</h3>
      <button className={styles.editBtn} onClick={onEdit} type="button">
        <Edit size={14} /> Edit
      </button>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);

interface RowProps {
  label: string;
  value?: string;
}

const Row = ({ label, value }: RowProps) => (
  <div className={styles.row}>
    <span className={styles.rowLabel}>{label}</span>
    <span className={styles.rowValue}>{value || "—"}</span>
  </div>
);

const propertyConfig = {
  House: {
    show: ["bedrooms", "bathrooms", "floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: [] as string[],
  },
  Apartment: {
    show: ["bedrooms", "bathrooms", "floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: [] as string[],
  },
  Villa: {
    show: ["bedrooms", "bathrooms", "floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: [] as string[],
  },
  "Plot / Land": {
    show: ["facingDirection", "possession"],
    hide: ["bedrooms", "bathrooms", "floors", "parking", "yearBuilt", "furnishing"],
  },
  Agricultural: {
    show: [] as string[],
    hide: ["bedrooms", "bathrooms", "floors", "parking", "facingDirection", "yearBuilt", "furnishing"],
  },
  Commercial: {
    show: ["floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: ["bedrooms", "bathrooms"],
  },
  Shop: {
    show: ["floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: ["bedrooms", "bathrooms"],
  },
  Office: {
    show: ["floors", "parking", "facingDirection", "possession", "yearBuilt", "furnishing"],
    hide: ["bedrooms", "bathrooms"],
  },
  Warehouse: {
    show: ["parking", "facingDirection", "possession", "yearBuilt"],
    hide: ["bedrooms", "bathrooms", "floors", "furnishing"],
  },
};

const ReviewSubmit = ({ onBack, onEditStep }: ReviewSubmitProps) => {
  const navigate = useNavigate();
  const { data, updateData, resetData } = useProperty();
  const { token, isAuthenticated } = useAuthContext();
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleMapUpdate = async (lat: number, lng: number) => {
    toast.loading("Updating location...", { id: "locUpdate" });
    const result = await reverseGeocodeLatLng(lat, lng, data.city, data.locality, data.address);
    if (result) {
      updateData({
        city: result.city,
        locality: result.locality,
        address: result.address,
        lat: result.lat,
        lng: result.lng
      });
      toast.success("Location updated successfully!", { id: "locUpdate" });
    } else {
      toast.error("Failed to update location", { id: "locUpdate" });
    }
  };

  // ⭐ DEBUG - Console mein data dekhne ke liye
  console.log("📦 Review Page Data:", data);

  const formatPrice = (p?: string) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const propertyType = data.propertyType || "House";
  const config =
    propertyConfig[propertyType as keyof typeof propertyConfig] ||
    propertyConfig.House;

  const isFieldVisible = (param: string) => !config.hide.includes(param);

  // ⭐ Edit handlers - jump to specific step
  const handleEditBasic = () => {
    console.log("✏️ Edit Basic clicked");
    if (onEditStep) {
      onEditStep(1);
    } else {
      navigate("/post-property");
    }
  };

  const handleEditMedia = () => {
    console.log("✏️ Edit Media clicked");
    if (onEditStep) {
      onEditStep(2);
    } else {
      navigate("/post-property");
    }
  };

  // ⭐ Back button handler
  const handleBack = () => {
    console.log("⬅️ Back clicked");
    if (onBack) {
      onBack();
    } else {
      navigate("/post-property");
    }
  };

  // ⭐ Publish handler - submit to backend
  const handlePublish = async () => {
    if (!agree1 || !agree2) {
      toast.error("Please accept the required terms");
      return;
    }

    const authToken =
      token ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!authToken || !isAuthenticated) {
      toast.error("You must be logged in to post a property.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      const textFields: (keyof PropertyData)[] = [
        "purpose", "propertyType", "title", "description", "areaSize", "areaUnit",
        "bedrooms", "bathrooms", "floors", "parking", "yearBuilt", "furnishing",
        "possession", "facing", "price", "downPayment", "monthlyInstallment",
        "duration", "monthlyRent", "securityDeposit", "advanceMonths",
        "city", "locality", "address", "videoUrl", "floorPlan",
      ];

      textFields.forEach((key) => {
        const value = data[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key as string, String(value));
        }
      });

      formData.append("negotiable", String(data.negotiable ?? false));
      formData.append("installmentAvailable", String(data.installmentAvailable ?? false));
      formData.append("amenities", JSON.stringify(data.amenities || []));
      formData.append("status", "pending");

      (data.imageFiles || []).forEach((img) => {
        if (img.file instanceof File && img.file.size > 0) {
          formData.append("images", img.file);
        }
      });

      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message || result.error || "Failed to publish property"
        );
      }

      toast.success("Property submitted successfully!");
      resetData(); // ⭐ Form clear after success

      // ⭐ Navigate to PropertySubmitted page with property data
      navigate("/property-submitted", {
        state: {
          propertyId: result.data?.id,
          propertyTitle: result.data?.title,
        },
      });
    } catch (err: unknown) {
      console.error("Publish error:", err);
      const message =
        err instanceof Error ? err.message : "Error publishing property";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ⭐ Direct form return - parent (CreatePropertyPost) handles navbar/heading
    <div className={styles.form}>
      {/* ============ A. Basic Information ============ */}
      <Section title="A. Basic Information" onEdit={handleEditBasic}>
        <div className={styles.grid2}>
          <Row
            label="Purpose"
            value={data.purpose ? `For ${data.purpose}` : undefined}
          />
          <Row label="Property Type" value={data.propertyType} />
          <Row label="Title" value={data.title} />
        </div>
        <Row label="Description" value={data.description} />
      </Section>

      {/* ============ B. Property Details ============ */}
      <Section title="B. Property Details" onEdit={handleEditBasic}>
        <div className={styles.grid2}>
          <Row
            label="Area Size"
            value={
              data.areaSize
                ? `${data.areaSize} ${data.areaUnit || ""}`
                : undefined
            }
          />
          {isFieldVisible("yearBuilt") && (
            <Row label="Year Built" value={data.yearBuilt} />
          )}
          {isFieldVisible("bedrooms") && (
            <Row label="Bedrooms" value={data.bedrooms} />
          )}
          {isFieldVisible("furnishing") && (
            <Row label="Furnishing" value={data.furnishing} />
          )}
          {isFieldVisible("bathrooms") && (
            <Row label="Bathrooms" value={data.bathrooms} />
          )}
          {isFieldVisible("floors") && (
            <Row label="Floors" value={data.floors} />
          )}
          {isFieldVisible("parking") && (
            <Row label="Parking" value={data.parking} />
          )}
          {isFieldVisible("possession") && (
            <Row label="Possession" value={data.possession} />
          )}
          {isFieldVisible("facingDirection") && (
            <Row label="Facing Direction" value={data.facing} />
          )}
        </div>
      </Section>

      {/* ============ C. Pricing Details ============ */}
      <Section title="C. Pricing Details" onEdit={handleEditBasic}>
        <div className={styles.grid2}>
          <Row
            label="Price (PKR)"
            value={data.price ? `PKR ${formatPrice(data.price)}` : undefined}
          />
          <Row
            label="Price Negotiable"
            value={data.negotiable ? "Yes" : "No"}
          />
          {data.installmentAvailable && (
            <>
              <Row
                label="Down Payment"
                value={
                  data.downPayment
                    ? `PKR ${formatPrice(data.downPayment)}`
                    : undefined
                }
              />
              <Row
                label="Monthly Installment"
                value={
                  data.monthlyInstallment
                    ? `PKR ${formatPrice(data.monthlyInstallment)}`
                    : undefined
                }
              />
              <Row label="Duration" value={data.duration} />
            </>
          )}
          <Row
            label="Installment Available"
            value={data.installmentAvailable ? "Yes" : "No"}
          />
          {data.monthlyRent && (
            <>
              <Row
                label="Monthly Rent"
                value={`PKR ${formatPrice(data.monthlyRent)}`}
              />
              <Row
                label="Security Deposit"
                value={
                  data.securityDeposit
                    ? `PKR ${formatPrice(data.securityDeposit)}`
                    : undefined
                }
              />
              <Row label="Advance Months" value={data.advanceMonths} />
            </>
          )}
        </div>
      </Section>

      {/* ============ D. Amenities ============ */}
      <Section title="D. Amenities & Features" onEdit={handleEditBasic}>
        <div className={styles.chips}>
          {(data.amenities || []).length > 0 ? (
            (data.amenities || []).map((a, i) => (
              <span key={i} className={styles.chip}>
                {a}
              </span>
            ))
          ) : (
            <span className={styles.muted}>No amenities selected</span>
          )}
        </div>
      </Section>

      {/* ============ E. Media ============ */}
      <Section title="E. Media" onEdit={handleEditMedia}>
        <p className={styles.muted}>
          {(data.imageFiles || []).length} image
          {(data.imageFiles || []).length !== 1 ? "s" : ""} uploaded
        </p>
        <div className={styles.imgGrid}>
          {(data.imageFiles || []).slice(0, 8).map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`prop-${i}`}
              className={styles.thumb}
            />
          ))}
        </div>
        {data.videoUrl && (
          <p className={styles.muted} style={{ marginTop: 10 }}>
            Video URL: {data.videoUrl}
          </p>
        )}
      </Section>

      {/* ============ F. Location ============ */}
      <Section title="F. Location" onEdit={handleEditMedia}>
        <div className={styles.grid2}>
          <Row label="City" value={data.city} />
          <Row label="Area / Locality" value={data.locality} />
        </div>
        <Row label="Address" value={data.address} />
        {data.lat && data.lng ? (
          <div style={{ marginTop: '10px', height: '400px', overflow: 'hidden', borderRadius: '8px' }}>
            <Map lat={data.lat} lng={data.lng} onMapClick={handleMapUpdate} />
          </div>
        ) : (
          <div className={styles.mapBox}>
            <MapPin size={28} color="#2563eb" />
            <span>Map Preview Not Available</span>
          </div>
        )}
      </Section>

      {/* ============ Terms & Conditions ============ */}
      <div className={styles.terms}>
        {/* ⭐ Checkbox 1 - Confirm info */}
        <label>
          <input
            type="checkbox"
            checked={agree1}
            onChange={() => setAgree1(!agree1)}
          />
          I confirm all information is accurate and I am authorized to list this
          property *
        </label>

        {/* ⭐ Checkbox 2 - Terms & Privacy with links */}
        <label>
          <input
            type="checkbox"
            checked={agree2}
            onChange={() => setAgree2(!agree2)}
          />
          I agree to Zameen 360's{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>{" "}
          *
        </label>

        {/* ⭐ Checkbox 3 - Notifications */}
        <label>
          <input
            type="checkbox"
            checked={notify}
            onChange={() => setNotify(!notify)}
          />
          Send me notifications about listing performance
        </label>
      </div>

      {/* ============ Action Buttons ============ */}
      <div className={styles.actions}>
        <button
          className={styles.draftBtn}
          onClick={handleBack}
          disabled={loading}
          type="button"
        >
          <Save size={16} /> Back
        </button>
        <button
          className={styles.publishBtn}
          onClick={handlePublish}
          disabled={loading}
          type="button"
        >
          <Rocket size={16} />{" "}
          {loading ? "Publishing..." : "Publish Property"}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;