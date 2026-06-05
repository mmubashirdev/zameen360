import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Rocket, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@shared/lib/axios";
import DashboardNavbar from "../components/DashboardNavbar";
import ProgressSteps from "../components/PostProperty/ProgressSteps";
import { useProperty } from "../components/context/useProperty";
import styles from "../components/media/styles/ReviewSubmit.module.css";

interface SectionProps {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}

const Section = ({ title, onEdit, children }: SectionProps) => (
  <div className={styles.card}>
    <div className={styles.cardHead}>
      <h3>{title}</h3>
      <button className={styles.editBtn} onClick={onEdit}>
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
    show: [
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: [],
  },
  Apartment: {
    show: [
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: [],
  },
  Villa: {
    show: [
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: [],
  },
  "Plot / Land": {
    show: ["facingDirection", "possession"],
    hide: [
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "yearBuilt",
      "furnishing",
    ],
  },
  Agricultural: {
    show: [],
    hide: [
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "facingDirection",
      "yearBuilt",
      "furnishing",
    ],
  },
  Commercial: {
    show: [
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: ["bedrooms", "bathrooms"],
  },
  Shop: {
    show: [
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: ["bedrooms", "bathrooms"],
  },
  Office: {
    show: [
      "floors",
      "parking",
      "facingDirection",
      "possession",
      "yearBuilt",
      "furnishing",
    ],
    hide: ["bedrooms", "bathrooms"],
  },
  Warehouse: {
    show: ["parking", "facingDirection", "possession", "yearBuilt"],
    hide: ["bedrooms", "bathrooms", "floors", "furnishing"],
  },
};

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const { data } = useProperty();
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(false);

  const formatPrice = (p?: string) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const propertyType = data.propertyType || "House";
  const config =
    propertyConfig[propertyType as keyof typeof propertyConfig] ||
    propertyConfig.House;

  const isFieldVisible = (param: string) => !config.hide.includes(param);

const handlePublish = async () => {
  if (!agree1 || !agree2) {
    toast.error("Please accept the required terms");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();

    const textFields: (keyof typeof data)[] = [
      "purpose",
      "propertyType",
      "title",
      "description",
      "areaSize",
      "areaUnit",
      "bedrooms",
      "bathrooms",
      "floors",
      "parking",
      "yearBuilt",
      "furnishing",
      "possession",
      "facing",
      "price",
      "downPayment",
      "monthlyInstallment",
      "duration",
      "monthlyRent",
      "securityDeposit",
      "advanceMonths",
      "city",
      "locality",
      "address",
      "videoUrl",
      "floorPlan",
    ];

    textFields.forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    formData.append("negotiable", String(data.negotiable ?? false));
    formData.append(
      "installmentAvailable",
      String(data.installmentAvailable ?? false),
    );
    formData.append("amenities", JSON.stringify(data.amenities || []));
    formData.append("status", "published");

    (data.imageFiles || []).forEach((img) => {
      if (img.file instanceof File && img.file.size > 0) {
        formData.append("images", img.file);
      }
    });

    // ✅ Read token from localStorage
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to post a property.");
      navigate("/login");
      return;
    }

    const res = await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
      },
      body: formData,
    });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message || result.error || "Failed to publish property",
        );
      }

    toast.success("Property submitted! Waiting for admin approval.");
    navigate("/buy");
  } catch (err: unknown) {
    console.error("Publish error:", err);
    const message =
      err instanceof Error ? err.message : "Error publishing property";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  const handleBack = () => {
    navigate("/media-and-details");
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>Post Your Property</h1>
          <p>
            List your property in 3 easy steps and reach thousands of buyers
          </p>
          <span className={styles.required}>
            Fields marked with <span className={styles.req}>*</span> are
            required
          </span>
        </div>

        <ProgressSteps currentStep={3} />

        <div className={styles.form}>
          {/* A. Basic Information */}
          <Section
            title="A. Basic Information"
            onEdit={() => navigate("/post-property")}
          >
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

          {/* B. Property Details */}
          <Section
            title="B. Property Details"
            onEdit={() => navigate("/post-property")}
          >
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

          {/* C. Pricing Details */}
          <Section
            title="C. Pricing Details"
            onEdit={() => navigate("/post-property")}
          >
            <div className={styles.grid2}>
              <Row
                label="Price (PKR)"
                value={
                  data.price ? `PKR ${formatPrice(data.price)}` : undefined
                }
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

          {/* D. Amenities */}
          <Section
            title="D. Amenities & Features"
            onEdit={() => navigate("/post-property")}
          >
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

          {/* E. Media */}
          <Section
            title="E. Media"
            onEdit={() => navigate("/media-and-details")}
          >
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

          {/* F. Location */}
          <Section
            title="F. Location"
            onEdit={() => navigate("/media-and-details")}
          >
            <div className={styles.grid2}>
              <Row label="City" value={data.city} />
              <Row label="Area / Locality" value={data.locality} />
            </div>
            <Row label="Address" value={data.address} />
            <div className={styles.mapBox}>
              <MapPin size={28} color="#2563eb" />
              <span>Map Preview</span>
            </div>
          </Section>

          {/* Terms */}
          <div className={styles.terms}>
            <label>
              <input
                type="checkbox"
                checked={agree1}
                onChange={() => setAgree1(!agree1)}
              />
              I confirm all information is accurate and I am authorized to list
              this property *
            </label>
            <label>
              <input
                type="checkbox"
                checked={agree2}
                onChange={() => setAgree2(!agree2)}
              />
              I agree to Zameen 360's <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a> *
            </label>
            <label>
              <input
                type="checkbox"
                checked={notify}
                onChange={() => setNotify(!notify)}
              />
              Send me notifications about listing performance
            </label>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.draftBtn}
              onClick={handleBack}
              disabled={loading}
            >
              <Save size={16} /> Back
            </button>
            <button
              className={styles.publishBtn}
              onClick={handlePublish}
              disabled={loading}
            >
              <Rocket size={16} />{" "}
              {loading ? "Publishing..." : "Publish Property"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewSubmit;
