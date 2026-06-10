// LivePreview.tsx
import React from 'react';
import styles from './styles/LivePreview.module.css';
import type { UploadedImage } from './types';
import { useProperty } from '../context/useProperty';

interface LivePreviewProps {
  coverImage: UploadedImage | null;
}

// ⭐ Property type config
const propertyConfig: Record<string, { hide: string[] }> = {
  House: { hide: [] },
  Apartment: { hide: [] },
  Villa: { hide: [] },
  "Plot / Land": { 
    hide: ["bedrooms", "bathrooms"]  // ⭐ Hidden for Plot
  },
  Agricultural: { 
    hide: ["bedrooms", "bathrooms"]  // ⭐ Hidden for Agricultural
  },
  Commercial: { hide: ["bedrooms", "bathrooms"] },
  Shop: { hide: ["bedrooms", "bathrooms"] },
  Office: { hide: ["bedrooms", "bathrooms"] },
  Warehouse: { hide: ["bedrooms", "bathrooms"] },
  Hotel: { hide: [] },
};

const LivePreview: React.FC<LivePreviewProps> = ({ coverImage }) => {
  const { data } = useProperty();

  const formatPrice = (p?: string | number) => {
    if (!p) return '0';
    return new Intl.NumberFormat('en-IN').format(Number(p));
  };

  // ⭐ Determine which fields to show
  const propertyType = data.propertyType || "House";
  const config = propertyConfig[propertyType] || { hide: [] };
  
  const showBedrooms = !config.hide.includes("bedrooms");
  const showBathrooms = !config.hide.includes("bathrooms");

  return (
    <aside className={styles.sidebar}>
      <h4 className={styles.title}>Live Preview</h4>
      <p className={styles.sub}>This is how your listing will appear</p>

      <div className={styles.card}>
        <div className={styles.imgWrap}>
          {coverImage ? (
            <img src={coverImage.url} alt="Property cover" />
          ) : (
            <div className={styles.noImg}>No cover image</div>
          )}
          <span className={styles.heart}>Save</span>
          <span className={styles.forSale}>For {data.purpose || 'Sale'}</span>
        </div>
        <div className={styles.info}>
          <h5>{data.title || 'Beautiful Property'}</h5>
          <p className={styles.addr}>
            {data.locality || 'Location'}, {data.city || 'City'}
          </p>
          <p className={styles.price}>PKR {formatPrice(data.price) || '0'}</p>
          
          {/* ⭐ Conditional - Beds/Baths sirf relevant types pe dikhenge */}
          <div className={styles.specs}>
            {showBedrooms && (
              <span>{data.bedrooms || '—'} Beds</span>
            )}
            {showBathrooms && (
              <span>{data.bathrooms || '—'} Baths</span>
            )}
            <span>
              {data.areaSize || '—'} {data.areaUnit || ''}
            </span>
          </div>

          <div className={styles.amenities}>
            {(data.amenities || []).slice(0, 3).map((a, i) => (
              <span key={i}>{a}</span>
            ))}
            {(data.amenities || []).length > 3 && (
              <span>+{(data.amenities || []).length - 3} more</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tips}>
        <h6>Listing Tips</h6>
        <ul>
          <li>Upload 10+ high-quality images</li>
          <li>Write detailed description (200+ words)</li>
          <li>Set competitive market price</li>
          <li>Add all available amenities</li>
          <li>Include floor plans for better response</li>
          <li>3D tour increases views by 40%</li>
        </ul>
      </div>

      <div className={styles.help}>
        <h6>Need Help?</h6>
        <p>Call: 0300-1234567</p>
        <p>WhatsApp Support</p>
        <p>Email: help@zameen360.com</p>
      </div>

      <div className={styles.secure}>
        Your information is secure and will never be shared with anyone.
      </div>
    </aside>
  );
};

export default LivePreview;