// client/src/features/marketplace/components/PostProperty/BasicInformation.tsx
import { useCallback } from "react";
import {
  Tag,
  Key,
  FileText,
  Home,
  Building,
  Store,
  Map,
  Castle,
  ShoppingBag,
  Briefcase,
  Warehouse,
  Sprout,
  Hotel,
} from "lucide-react";
import styles from "../PostProperty/styles/BasicInformation.module.css";
import { useProperty } from "../context/useProperty";

// ✅ Fix 1: No import needed from schema here — validation
//    is handled at the page level (CreatePropertyPost)

const BasicInformation = () => {
  const { data, updateData, errors } = useProperty(); // ✅ errors from context

  const purpose = data.purpose ?? "";
  const propertyType = data.propertyType ?? "";
  const title = data.title ?? "";
  const description = data.description ?? "";

  // ✅ Fix 2: No unused handleNext — removed entirely
  const handlePurposeChange = useCallback(
    (newPurpose: string) => updateData({ purpose: newPurpose }),
    [updateData],
  );

  const handlePropertyTypeChange = useCallback(
    (newType: string) => updateData({ propertyType: newType }),
    [updateData],
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => updateData({ title: newTitle }),
    [updateData],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string) => updateData({ description: newDescription }),
    [updateData],
  );

  const purposes = [
    { label: "Sell", icon: <Tag size={25} /> },
    { label: "Rent", icon: <Key size={25} /> },
    { label: "Lease", icon: <FileText size={25} /> },
  ];

  const types = [
    { label: "House", icon: <Home size={20} /> },
    { label: "Apartment", icon: <Building size={20} /> },
    { label: "Commercial", icon: <Store size={20} /> },
    { label: "Plot / Land", icon: <Map size={20} /> },
    { label: "Villa", icon: <Castle size={20} /> },
    { label: "Shop", icon: <ShoppingBag size={20} /> },
    { label: "Office", icon: <Briefcase size={20} /> },
    { label: "Warehouse", icon: <Warehouse size={20} /> },
    { label: "Agricultural", icon: <Sprout size={20} /> },
    { label: "Hotel", icon: <Hotel size={20} /> },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Basic Information</h3>

      <div className={styles.grid}>
        {/* ── Left column ── */}
        <div>
          <label className={styles.label}>
            Purpose <span className={styles.req}>*</span>
          </label>
          <div className={styles.optionGrid3}>
            {purposes.map((p) => (
              <div
                key={p.label}
                className={`${styles.option} ${purpose === p.label ? styles.active : ""}`}
                onClick={() => handlePurposeChange(p.label)}
              >
                <div className={styles.iconWrap}>{p.icon}</div>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
          {/* ✅ Validation error for purpose */}
          {errors?.purpose && <p className={styles.error}>{errors.purpose}</p>}

          <label className={styles.label} style={{ marginTop: 16 }}>
            Property Title <span className={styles.req}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors?.title ? styles.inputError : ""}`}
            placeholder="e.g., Beautiful 5 Marla House in DHA"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          {/* ✅ Validation error for title */}
          {errors?.title && <p className={styles.error}>{errors.title}</p>}
          <span className={styles.counter}>{title.length}/100</span>
        </div>

        {/* ── Right column ── */}
        <div>
          <label className={styles.label}>
            Property Type <span className={styles.req}>*</span>
          </label>
          <div className={styles.optionGrid5}>
            {types.map((t) => (
              <div
                key={t.label}
                className={`${styles.option} ${propertyType === t.label ? styles.active : ""}`}
                onClick={() => handlePropertyTypeChange(t.label)}
              >
                <div className={styles.iconWrap}>{t.icon}</div>
                <span className={styles.optionLabel}>{t.label}</span>
              </div>
            ))}
          </div>
          {/* ✅ Validation error for propertyType */}
          {errors?.propertyType && (
            <p className={styles.error}>{errors.propertyType}</p>
          )}
          <label className={styles.label} style={{ marginTop: 16 }}>
            Description <span className={styles.req}>*</span>
          </label>
          <textarea
            className={`${styles.textarea} ${errors?.description ? styles.inputError : ""}`}
            placeholder="Describe your property in detail..."
            rows={4}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
          {/* ✅ Validation error for description */}
          {errors?.description && (
            <p className={styles.error}>{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
