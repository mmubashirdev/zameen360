import { Eye, MapPin, Bed, Bath, Maximize, Heart, Lightbulb, CheckCircle, Headphones, Phone, MessageCircle, Mail, Shield } from 'lucide-react';
import styles from '../PostProperty/styles/LivePreview.module.css';

const LivePreview = () => {
  const tips = [
    'Upload 10+ high-quality images',
    'Write detailed description (200+ words)',
    'Set competitive market price',
    'Add all available amenities',
    'Include floor plans for better response',
    '3D tour increases views by 40%',
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Eye size={16} />
          <span className={styles.headerTitle}>Live Preview</span>
        </div>
        <p className={styles.subtitle}>This is how your listing will appear</p>
        <div className={styles.imageWrap}>
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" alt="house" />
          <span className={styles.tag}>For Sale</span>
          <Heart className={styles.heart} size={20} />
        </div>
        <h4 className={styles.propTitle}>Beautiful 5 Marla House in DHA Phase 6</h4>
        <div className={styles.location}><MapPin size={14} /> DHA Phase 6, Lahore, Punjab</div>
        <div className={styles.price}>PKR 2,50,00,000</div>
        <div className={styles.specs}>
          <div><Bed size={16} /><div>5<span>Beds</span></div></div>
          <div><Bath size={16} /><div>6<span>Baths</span></div></div>
          <div><Maximize size={16} /><div>5 Marla<span>Area</span></div></div>
        </div>
        <div className={styles.chips}>
          <span>Central AC</span><span>Lawn/Garden</span><span>CCTV</span><span className={styles.more}>+3 more</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tipsHeader}><Lightbulb size={16} color="#2563eb"/> Listing Tips</div>
        {tips.map((t,i) => (
          <div key={i} className={styles.tip}><CheckCircle size={14} color="#2563eb"/> {t}</div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.tipsHeader}><Headphones size={16}/> Need Help?</div>
        <div className={styles.helpItem}><Phone size={14}/> Call: 0300-1234567</div>
        <div className={styles.helpItem}><MessageCircle size={14}/> WhatsApp Support</div>
        <div className={styles.helpItem}><Mail size={14}/> Email: help@zameen360.com</div>
      </div>

      <div className={styles.secureCard}>
        <Shield size={20} color="#2563eb"/>
        <span>Your information is secure and will never be shared with anyone.</span>
      </div>
    </aside>
  );
};

export default LivePreview;