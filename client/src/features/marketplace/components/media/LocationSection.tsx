import React, { useState, useCallback } from 'react';
import Map from './Map';
import styles from './styles/LocationSection.module.css';

interface LatLng {
  lat: number;
  lng: number;
}

interface LocationSectionProps {
  onDataChange?: (data: Partial<{city: string; locality: string; address: string}>) => void;
}

const defaultCenter: LatLng = { lat: 31.4697, lng: 74.4111 };

const LocationSection: React.FC<LocationSectionProps> = ({ onDataChange }) => {
  const [position, setPosition] = useState<LatLng>(defaultCenter);
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('DHA Phase 6');
  const [address, setAddress] = useState('House 123, Street 5, Sector A, DHA Phase 6, Lahore, Punjab, Pakistan');
  const [searchValue, setSearchValue] = useState('');

  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity);
    onDataChange?.({ city: newCity });
  }, [onDataChange]);

  const handleAreaChange = useCallback((newArea: string) => {
    setArea(newArea);
    onDataChange?.({ locality: newArea });
  }, [onDataChange]);

  const handleAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
    onDataChange?.({ address: newAddress });
  }, [onDataChange]);

  const useMyLocation = (): void => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((currentPosition) => {
      setPosition({
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      });
    });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>B. Property Location</h3>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label>
            City <span className={styles.req}>*</span>
          </label>
          <select value={city} onChange={(event) => handleCityChange(event.target.value)}>
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>
            Area / Locality <span className={styles.req}>*</span>
          </label>
          <select value={area} onChange={(event) => handleAreaChange(event.target.value)}>
            <option>DHA Phase 6</option>
            <option>DHA Phase 5</option>
            <option>Bahria Town</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>
            Full Address <span className={styles.req}>*</span>
          </label>
          <textarea value={address} onChange={(event) => handleAddressChange(event.target.value)} />
        </div>
      </div>

      <label className={styles.pinLabel}>
        Pin Your Property on Map <span className={styles.req}>*</span>
      </label>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search location or address..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <button className={styles.locBtn} type="button" onClick={useMyLocation}>
          Use My Current Location
        </button>
      </div>

      <div className={styles.mapWrap}>
        <Map 
          lat={position.lat} 
          lng={position.lng}
          onMapClick={(lat, lng) => setPosition({ lat, lng })}
        />
        <div className={styles.mapInfo}>
          <div>
            <strong>{searchValue || `${area}, ${city}`}</strong>
          </div>
          <div>{address}</div>
          <div>
            Lat: {position.lat.toFixed(4)} | Lng: {position.lng.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
