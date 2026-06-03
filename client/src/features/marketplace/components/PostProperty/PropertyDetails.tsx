import { useCallback } from "react";
import styles from "../PostProperty/styles/PropertyDetails.module.css";
import { useProperty } from "../context/useProperty";

type PropertyField =
  | "bedrooms"
  | "bathrooms"
  | "floors"
  | "parking"
  | "facingDirection"
  | "possession"
  | "yearBuilt"
  | "furnishing";
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

const PropertyDetails = () => {
  const { data, updateData } = useProperty();

  const propertyType = data.propertyType || "House";
  const config =
    propertyConfig[propertyType as keyof typeof propertyConfig] ||
    propertyConfig.House;

  

  const isFieldVisible = (field: PropertyField) => !config.hide.includes(field);

  const beds = data.bedrooms || "5";
  const baths = data.bathrooms || "6";
  const floors = data.floors || "2";
  const parking = data.parking || "2";
  const furnishing = data.furnishing || "Semi-Furnished";
  const possession = data.possession || "Ready to Move";
  const areaSize = data.areaSize || "";
  const areaUnit = data.areaUnit || "Marla";
  const yearBuilt = data.yearBuilt || "2023";
  const facing = data.facing || "North";

  const handleUpdate = useCallback(
    (updates: Partial<typeof data>) => {
      updateData(updates);
    },
    [updateData],
  );

  const handleAreaSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, or only values >= 1
    if (value === "" || (Number(value) > 0 && !isNaN(Number(value)))) {
      handleUpdate({ areaSize: value });
    }
  };

  const bedOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const bathOptions = ["1", "2", "3", "4", "5", "6", "7", "8+"];
  const floorOptions = ["1", "2", "3", "4", "5+"];
  const parkOptions = ["0", "1", "2", "3", "4+"];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>B. Property Details</h3>
      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>
            Area Size <span className={styles.req}>*</span>
          </label>
          <div className={styles.row}>
            <input
              className={styles.input}
              type="number"
              min="1"
              placeholder="Min 1"
              value={areaSize}
              onChange={handleAreaSizeChange}
            />
            <select
              className={styles.select}
              value={areaUnit}
              onChange={(e) => handleUpdate({ areaUnit: e.target.value })}
            >
              <option>Marla</option>
              <option>Kanal</option>
              <option>Sqft</option>
              <option>Sqm</option>
            </select>
          </div>
        </div>
        {isFieldVisible("bedrooms") && (
          <div>
            <label className={styles.label}>
              Bedrooms <span className={styles.req}>*</span>
            </label>
            <div className={styles.btnRow}>
              {bedOptions.map((b) => (
                <button
                  key={b}
                  className={`${styles.numBtn} ${beds === b ? styles.numActive : ""}`}
                  onClick={() => handleUpdate({ bedrooms: b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
        {isFieldVisible("bathrooms") && (
          <div>
            <label className={styles.label}>
              Bathrooms <span className={styles.req}>*</span>
            </label>
            <div className={styles.btnRow}>
              {bathOptions.map((b) => (
                <button
                  key={b}
                  className={`${styles.numBtn} ${baths === b ? styles.numActive : ""}`}
                  onClick={() => handleUpdate({ bathrooms: b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.grid3}>
        {isFieldVisible("floors") && (
          <div>
            <label className={styles.label}>Floors</label>
            <div className={styles.btnRow}>
              {floorOptions.map((f) => (
                <button
                  key={f}
                  className={`${styles.numBtn} ${floors === f ? styles.numActive : ""}`}
                  onClick={() => handleUpdate({ floors: f })}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        {isFieldVisible("parking") && (
          <div>
            <label className={styles.label}>Parking</label>
            <div className={styles.btnRow}>
              {parkOptions.map((p) => (
                <button
                  key={p}
                  className={`${styles.numBtn} ${parking === p ? styles.numActive : ""}`}
                  onClick={() => handleUpdate({ parking: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {isFieldVisible("yearBuilt") && (
          <div>
            <label className={styles.label}>Year Built</label>
            <select
              className={styles.select}
              value={yearBuilt}
              onChange={(e) => handleUpdate({ yearBuilt: e.target.value })}
            >
              {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.grid3}>
        {isFieldVisible("furnishing") && (
          <div>
            <label className={styles.label}>
              Furnishing <span className={styles.req}>*</span>
            </label>
            <div className={styles.tabRow}>
              {["Unfurnished", "Semi-Furnished", "Fully Furnished"].map((f) => (
                <button
                  key={f}
                  className={`${styles.tab} ${furnishing === f ? styles.tabActive : ""}`}
                  onClick={() => handleUpdate({ furnishing: f })}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        {isFieldVisible("possession") && (
          <div>
            <label className={styles.label}>
              Possession <span className={styles.req}>*</span>
            </label>
            <div className={styles.tabRow}>
              {[
                propertyType === "Agricultural"
                  ? "Ready to Cultivate"
                  : "Ready to Move",
                propertyType === "Agricultural"
                  ? "Under Preparation"
                  : "Under Construction",
              ].map((p) => (
                <button
                  key={p}
                  className={`${styles.tab} ${possession === p ? styles.tabActive : ""}`}
                  onClick={() => handleUpdate({ possession: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {isFieldVisible("facingDirection") && (
          <div>
            <label className={styles.label}>Facing Direction</label>
            <select
              className={styles.select}
              value={facing}
              onChange={(e) => handleUpdate({ facing: e.target.value })}
            >
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
