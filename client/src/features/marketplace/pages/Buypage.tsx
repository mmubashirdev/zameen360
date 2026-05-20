import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import Navbar from '../components/PostProperty/PropertyNav';
import styles from '../components/PostProperty/styles/Buy.module.css';

interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
}

const Buy = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [purpose, setPurpose] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (purpose) params.append('purpose', purpose);
      if (propertyType) params.append('propertyType', propertyType);
      if (city) params.append('city', city);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await fetch(`http://localhost:5000/api/properties?${params}`);
      const result = await res.json();

      // ✅ Backend returns { success, count, data }
      if (result.success && Array.isArray(result.data)) {
        setProperties(result.data);
      } else if (Array.isArray(result)) {
        // fallback in case backend returns plain array
        setProperties(result);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setSearch('');
    setPurpose('');
    setPropertyType('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setTimeout(fetchProperties, 0);
  };

  const formatPrice = (p: string | number) => {
    if (!p) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(Number(p));
  };

  const handleSeeMore = (id: number) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Find Your Dream Property</h1>
          <p>Browse thousands of verified listings</p>
        </div>

        {/* Search & Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search by title, city or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
            />
          </div>

          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">All Purposes</option>
            <option value="Sell">For Sale</option>
            <option value="Rent">For Rent</option>
            <option value="Lease">Lease</option>
          </select>

          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot / Land">Plot / Land</option>
            <option value="Villa">Villa</option>
            <option value="Shop">Shop</option>
            <option value="Office">Office</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Agricultural">Agricultural</option>
          </select>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <button className={styles.searchBtn} onClick={fetchProperties}>
            Search
          </button>

          <button className={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </div>

        {/* Results Header */}
        <div className={styles.resultsHead}>
          <span>
            {loading ? 'Loading...' : `${properties.length} Properties Found`}
          </span>
        </div>

        {/* Results Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: 40 }}>Loading properties...</p>
        ) : properties.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No properties found.</p>
            <small>Try adjusting your filters or post your first property!</small>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map((p) => (
              <div
                key={p.id}
                className={styles.card}
                onClick={() => handleSeeMore(p.id)}
              >
                <div className={styles.imageWrap}>
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? p.images[0]
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                    }
                    alt={p.title}
                  />
                  <span className={styles.tag}>For {p.purpose}</span>
                  <Heart
                    className={styles.heart}
                    size={20}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className={styles.cardBody}>
                  <h4 className={styles.propTitle}>{p.title}</h4>

                  <div className={styles.location}>
                    <MapPin size={14} /> {p.locality}, {p.city}
                  </div>

                  <div className={styles.price}>PKR {formatPrice(p.price)}</div>

                  <div className={styles.specs}>
                    <div>
                      <Bed size={16} />
                      <span>{p.bedrooms} Beds</span>
                    </div>
                    <div>
                      <Bath size={16} />
                      <span>{p.bathrooms} Baths</span>
                    </div>
                    <div>
                      <Maximize size={16} />
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
        )}
      </main>
    </div>
  );
};

export default Buy;