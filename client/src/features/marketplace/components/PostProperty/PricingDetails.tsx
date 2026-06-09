// client/src/features/marketplace/components/PostProperty/PricingDetails.tsx
import { useCallback } from "react";
import styles from "../PostProperty/styles/PricingDetails.module.css";
import { useProperty } from "../context/useProperty";

const amenitiesList = [
  "Central AC",
  "Generator Backup",
  "Solar Panels",
  "Servant Quarter",
  "Lawn/Garden",
  "Boundary Wall",
  "Swimming Pool",
  "Gym Area",
  "CCTV Security",
  "Security System",
  "Gated Community",
  "Water Boring",
  "Gas Supply",
  "Internet Ready",
  "Parking/Garage",
  "Modular Kitchen",
];

const PricingDetails = () => {
  const { data, updateData, errors } = useProperty();

  const propertyType = data.propertyType || "House";
  const purpose = data.purpose || ""; // ✅ read purpose
  const isRentOrLease = purpose === "Rent" || purpose === "Lease"; // ✅ condition
  const isPlotOrLand =
    propertyType === "Plot / Land" || propertyType === "Agricultural";
  const negotiable = data.negotiable ?? false;
  const installment = data.installmentAvailable ?? false;
  const price = data.price || "";
  const downPayment = data.downPayment || "";
  const monthlyInstall = data.monthlyInstallment || "";
  const duration = data.duration || "5 Years";
  const monthlyRent = data.monthlyRent || "";
  const securityDep = data.securityDeposit || "";
  const advanceMonths = data.advanceMonths || "";
  const selected = data.amenities || [];

  const handleUpdate = useCallback(
    (updates: Partial<typeof data>) => updateData(updates),
    [updateData],
  );

  const toggle = (a: string) => {
    const newAmenities = selected.includes(a)
      ? selected.filter((s) => s !== a)
      : [...selected, a];
    handleUpdate({ amenities: newAmenities });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>C. Pricing Details</h3>

      {/* ✅ Grid changes based on whether rent fields show */}
      <div className={isRentOrLease ? styles.grid : styles.gridNoRent}>
        {/* Price */}
        <div>
          <label className={styles.label}>
            Price (PKR) <span className={styles.req}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors?.price ? styles.inputError : ""}`}
            type="number"
            value={price}
            onChange={(e) => handleUpdate({ price: e.target.value })}
          />
          {errors?.price && <p className={styles.error}>{errors.price}</p>}
        </div>

        {/* Negotiable toggle */}
        <div className={styles.toggleWrap}>
          <label className={styles.label}>Price Negotiable?</label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={negotiable}
              onChange={() => handleUpdate({ negotiable: !negotiable })}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {/* ✅ For Rent Only - only shows when purpose is Rent or Lease */}
        {isRentOrLease && (
          <div className={styles.rentBox}>
            <div className={styles.rentTitle}>For {purpose} Only</div>
            <div className={styles.rentGrid}>
              <div>
                <label className={styles.smLabel}>Monthly Rent (PKR)</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="100,000"
                  value={monthlyRent}
                  onChange={(e) =>
                    handleUpdate({ monthlyRent: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={styles.smLabel}>Security Deposit</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="200,000"
                  value={securityDep}
                  onChange={(e) =>
                    handleUpdate({ securityDeposit: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={styles.smLabel}>Advance Months</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="3"
                  value={advanceMonths}
                  onChange={(e) =>
                    handleUpdate({ advanceMonths: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Installment toggle */}
      <div className={styles.installmentRow}>
        <label className={styles.label}>Installment Available?</label>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={installment}
            onChange={() =>
              handleUpdate({ installmentAvailable: !installment })
            }
          />
          <span className={styles.slider} />
        </label>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Down Payment (PKR)</label>
          <input
            className={styles.input}
            value={downPayment}
            onChange={(e) => handleUpdate({ downPayment: e.target.value })}
          />
        </div>
        <div>
          <label className={styles.label}>Monthly Installment (PKR)</label>
          <input
            className={styles.input}
            value={monthlyInstall}
            onChange={(e) =>
              handleUpdate({ monthlyInstallment: e.target.value })
            }
          />
        </div>
        <div>
          <label className={styles.label}>Duration</label>
          <select
            className={styles.input}
            value={duration}
            onChange={(e) => handleUpdate({ duration: e.target.value })}
          >
            {[
              "1 Year",
              "2 Years",
              "3 Years",
              "5 Years",
              "10 Years",
              "15 Years",
              "20 Years",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 className={styles.title} style={{ marginTop: 24 }}>
        D. Amenities & Features
      </h3>
      <div className={styles.amenities}>
        {amenitiesList
          .filter((a) =>
            isPlotOrLand
              ? ![
                  "Central AC",
                  "Solar Panels",
                  "Servant Quarter",
                  "Swimming Pool",
                  "Gym Area",
                  "Modular Kitchen",
                ].includes(a)
              : true,
          )
          .map((a, i) => (
            <label key={i} className={styles.amenity}>
              <input
                type="checkbox"
                checked={selected.includes(a)}
                onChange={() => toggle(a)}
              />
              <span>{a}</span>
            </label>
          ))}
      </div>
    </div>
  );
};

export default PricingDetails;
