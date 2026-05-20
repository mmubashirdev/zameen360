import React from 'react';
import styles from './styles/LivePreview.module.css';
import type { UploadedImage } from './types';

interface LivePreviewProps {
  coverImage: UploadedImage | null;
}

const LivePreview: React.FC<LivePreviewProps> = ({ coverImage }) => (
  <aside className={styles.sidebar}>
    <h4 className={styles.title}>Live Preview</h4>
    <p className={styles.sub}>This is how your listing will appear</p>

    <div className={styles.card}>
      <div className={styles.imgWrap}>
        {coverImage ? <img src={coverImage.url} alt="Property cover" /> : <div className={styles.noImg}>No cover image</div>}
        <span className={styles.heart}>Save</span>
        <span className={styles.forSale}>For Sale</span>
      </div>
      <div className={styles.info}>
        <h5>Beautiful 5 Marla House in DHA Phase 6</h5>
        <p className={styles.addr}>DHA Phase 6, Lahore, Punjab</p>
        <p className={styles.price}>PKR 2,50,00,000</p>
        <div className={styles.specs}>
          <span>5 Beds</span>
          <span>6 Baths</span>
          <span>5 Marla</span>
        </div>
        <div className={styles.amenities}>
          <span>Central AC</span>
          <span>Lawn/Garden</span>
          <span>CCTV</span>
          <span>+3 more</span>
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

    <div className={styles.secure}>Your information is secure and will never be shared with anyone.</div>
  </aside>
);

export default LivePreview;
