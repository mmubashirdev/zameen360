import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { getMyListings } from '../../../../api/seller.api';
import styles from '../media/styles/Buy.module.css';

interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  areaSize: string | number;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  status: string;
}

const SellerProperties: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📢 Fetching all seller listings (pending + approved)');
        // Fetch ALL listings without status filter to see pending + approved
        const data = await getMyListings({ limit: 100 });
        console.log('📦 API Response:', data);
        
        // API returns { listings: [...], pagination: {...} }
        const propertyList = data?.listings || [];
        console.log('✅ Total properties found:', propertyList.length);
        
        // Filter to show only approved properties on profile
        const approvedOnly = propertyList.filter((p: Property) => p.status === 'approved');
        console.log('✅ Approved properties:', approvedOnly.length);
        
        setProperties(Array.isArray(approvedOnly) ? approvedOnly : []);
      } catch (err) {
        console.error('❌ Error fetching seller properties:', err);
        setError('Failed to load properties');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  const formatPrice = (p: string | number) => {
    if (!p) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(Number(p));
  };

  const handleSeeMore = (id: number) => navigate(`/property/${id}`);

  if (loading) {
    return (
      <div style={{ width: '100%' }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Published Properties</h2>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonBody}>
                <div className={`${styles.skeletonLine} ${styles.skeletonW80} ${styles.skeletonH20}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonW60}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonW40} ${styles.skeletonH20}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%' }} className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div style={{ width: '100%' }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Published Properties</h2>
        <div className={styles.emptyState}>
          <p>No published properties yet</p>
          <small>Post your first property to get started!</small>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Published Properties ({properties.length})
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
          maxWidth: '100%',
        }}
      >
        {properties.map((p) => (
          <div
            key={p.id}
            className={styles.card}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => handleSeeMore(p.id)}
          >
            <div 
              className={styles.imageWrap}
              style={{
                height: '180px',
                overflow: 'hidden',
              }}
            >
              <img
                src={
                  p.images?.[0] ||
                  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                }
                alt={p.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <span className={styles.tag}>For {p.purpose}</span>
              <Heart
                className={styles.heart}
                size={18}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className={styles.cardBody}>
              <h4 className={styles.propTitle}>{p.title}</h4>
              <div className={styles.location}>
                <MapPin size={13} /> {p.locality}, {p.city}
              </div>
              <div className={styles.price}>PKR {formatPrice(p.price)}</div>
              <div className={styles.specs}>
                <div>
                  <Bed size={15} />
                  <span>{p.bedrooms} Beds</span>
                </div>
                <div>
                  <Bath size={15} />
                  <span>{p.bathrooms} Baths</span>
                </div>
                <div>
                  <Maximize size={15} />
                  <span>
                    {p.areaSize} {p.areaUnit}
                  </span>
                </div>
              </div>
              <div className={styles.chips}>
                {(p.amenities || []).slice(0, 3).map((a, i) => (
                  <span key={i}>{a}</span>
                ))}
                {(p.amenities || []).length > 3 && (
                  <span className={styles.more}>
                    +{p.amenities.length - 3} more
                  </span>
                )}
              </div>
              <button
                className={styles.seeMoreBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeeMore(p.id);
                }}
              >
                See More Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProperties;
