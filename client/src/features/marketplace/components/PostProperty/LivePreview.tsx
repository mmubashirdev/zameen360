import { Eye, MapPin, Bed, Bath, Maximize, Heart, Lightbulb, CheckCircle, Headphones, Phone, MessageCircle, Mail, Shield } from 'lucide-react';
import styles from '../PostProperty/styles/LivePreview.module.css';
import { useProperty } from '../context/useProperty';

const LivePreview = () => {
  const { data } = useProperty();

  const formatPrice = (p?: string | number) => {
    if (!p) return '0';
    return new Intl.NumberFormat('en-IN').format(Number(p));
  };

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
          <span className={styles.tag}>For {data.purpose || 'Sale'}</span>
          <Heart className={styles.heart} size={20} />
        </div>
        <h4 className={styles.propTitle}>{data.title || 'Beautiful Property'}</h4>
        <div className={styles.location}><MapPin size={14} /> {data.locality || 'Location'}, {data.city || 'City'}</div>
        <div className={styles.price}>PKR {formatPrice(data.price) || '0'}</div>
        <div className={styles.specs}>
          <div><Bed size={16} /><div>{data.bedrooms || '—'}<span>Beds</span></div></div>
          <div><Bath size={16} /><div>{data.bathrooms || '—'}<span>Baths</span></div></div>
          <div><Maximize size={16} /><div>{data.areaSize || '—'} {data.areaUnit || ''}<span>Area</span></div></div>
        </div>
        <div className={styles.chips}>
          {(data.amenities || []).slice(0, 3).map((a, i) => (
            <span key={i}>{a}</span>
          ))}
          {(data.amenities || []).length > 3 && (
            <span className={styles.more}>+{(data.amenities || []).length - 3} more</span>
          )}
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