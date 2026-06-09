// client/src/features/marketplace/components/media/LocationSection.tsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Map from './Map';
import styles from './styles/LocationSection.module.css';
import {
  ALL_CITY_NAMES,
  getLocalitiesForCity,
} from '../../constants/pakistanLocations';
import { reverseGeocodeLatLng } from '../../utils/geocoding';

interface LatLng {
  lat: number;
  lng: number;
}

interface LocationSectionProps {
  onDataChange?: (
    data: Partial<{ city: string; locality: string; address: string; lat: number; lng: number }>
  ) => void;
  // ⭐ Add initial values from context
  initialCity?: string;
  initialLocality?: string;
  initialAddress?: string;
}

const defaultCenter: LatLng = { lat: 31.4697, lng: 74.4111 };

const LocationSection: React.FC<LocationSectionProps> = ({
  onDataChange,
  initialCity,
  initialLocality,
  initialAddress,
}) => {
  const [position, setPosition] = useState<LatLng>(defaultCenter);

  // ⭐ Use initial values or defaults
  const [city, setCity] = useState(initialCity || 'Lahore');
  const [area, setArea] = useState(initialLocality || 'DHA Phase 6');
  const [address, setAddress] = useState(
    initialAddress || 'House 123, Street 5, Sector A, DHA Phase 6, Lahore, Punjab, Pakistan'
  );
  const [searchValue, setSearchValue] = useState('');

  // ─── City search state ──────────────────────────────────────────────────
  const [cityQuery, setCityQuery] = useState(initialCity || 'Lahore');
  const [isCityFocused, setIsCityFocused] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // ─── Locality search state ──────────────────────────────────────────────
  const [localityQuery, setLocalityQuery] = useState(initialLocality || 'DHA Phase 6');
  const [isLocalityFocused, setIsLocalityFocused] = useState(false);
  const localityRef = useRef<HTMLDivElement>(null);

  // ─── Filtered results ───────────────────────────────────────────────────
  const filteredCities = useMemo(() => {
    const q = cityQuery.toLowerCase().trim();
    if (!q) return ALL_CITY_NAMES.slice(0, 50);
    return ALL_CITY_NAMES.filter((c) => c.toLowerCase().includes(q)).slice(0, 50);
  }, [cityQuery]);

  const availableLocalities = useMemo(
    () => getLocalitiesForCity(city),
    [city]
  );

  const filteredLocalities = useMemo(() => {
    const q = localityQuery.toLowerCase().trim();
    if (!q) return availableLocalities.slice(0, 50);
    return availableLocalities
      .filter((l) => l.toLowerCase().includes(q))
      .slice(0, 50);
  }, [localityQuery, availableLocalities]);

  // ⭐ CRITICAL FIX: Sync default values to context on mount
  useEffect(() => {
    onDataChange?.({
      city: city,
      locality: area,
      address: address,
      lat: position.lat,
      lng: position.lng,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Close suggestions on outside click ─────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityFocused(false);
      }
      if (
        localityRef.current &&
        !localityRef.current.contains(e.target as Node)
      ) {
        setIsLocalityFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleCitySelect = useCallback(
    (newCity: string) => {
      setCity(newCity);
      setCityQuery(newCity);
      setIsCityFocused(false);
      // Reset locality when city changes
      setArea('');
      setLocalityQuery('');
      onDataChange?.({ city: newCity, locality: '' });
    },
    [onDataChange]
  );

  const handleLocalitySelect = useCallback(
    (newLocality: string) => {
      setArea(newLocality);
      setLocalityQuery(newLocality);
      setIsLocalityFocused(false);
      onDataChange?.({ locality: newLocality });
    },
    [onDataChange]
  );

  const handleAddressChange = useCallback(
    (newAddress: string) => {
      setAddress(newAddress);
      onDataChange?.({ address: newAddress });
    },
    [onDataChange]
  );

  const updateLocationFromLatLng = async (lat: number, lng: number) => {
    const result = await reverseGeocodeLatLng(lat, lng, city, area, address);
    if (result) {
      setCity(result.city);
      setCityQuery(result.city);
      setArea(result.locality);
      setLocalityQuery(result.locality);
      setAddress(result.address);

      onDataChange?.({ 
        city: result.city, 
        locality: result.locality, 
        address: result.address, 
        lat, 
        lng 
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    updateLocationFromLatLng(lat, lng);
  };

  const useMyLocation = (): void => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((currentPosition) => {
      const lat = currentPosition.coords.latitude;
      const lng = currentPosition.coords.longitude;
      setPosition({ lat, lng });
      updateLocationFromLatLng(lat, lng);
    });
  };

  const handleSearch = async () => {
    if (!searchValue) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}&countrycodes=pk`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition({ lat, lng });
        updateLocationFromLatLng(lat, lng);
      } else {
        alert("Location not found. Try adding city name to your search.");
      }
    } catch (e) {
      console.error('Forward geocoding error', e);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>B. Property Location</h3>

      <div className={styles.formRow}>
        {/* ── City (Searchable) ── */}
        <div className={styles.field} ref={cityRef}>
          <label>
            City <span className={styles.req}>*</span>
          </label>
          <div className={styles.autocompleteWrap}>
            <input
              className={styles.autoInput}
              type="text"
              placeholder="Search city…"
              value={cityQuery}
              required
              onChange={(e) => {
                setCityQuery(e.target.value);
                setIsCityFocused(true);
              }}
              onFocus={() => setIsCityFocused(true)}
            />
            {isCityFocused && filteredCities.length > 0 && (
              <ul className={styles.suggestions}>
                {filteredCities.map((c) => (
                  <li
                    key={c}
                    className={`${styles.suggestionItem} ${c === city ? styles.selectedItem : ''
                      }`}
                    onMouseDown={() => handleCitySelect(c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
            {isCityFocused && filteredCities.length === 0 && (
              <div className={styles.noResults}>No cities found</div>
            )}
          </div>
        </div>

        {/* ── Area / Locality (Searchable) ── */}
        <div className={styles.field} ref={localityRef}>
          <label>
            Area / Locality <span className={styles.req}>*</span>
          </label>
          <div className={styles.autocompleteWrap}>
            <input
              className={styles.autoInput}
              type="text"
              placeholder={
                city
                  ? `Search in ${city}…`
                  : 'Select a city first'
              }
              value={localityQuery}
              required
              disabled={!city}
              onChange={(e) => {
                setLocalityQuery(e.target.value);
                setIsLocalityFocused(true);
              }}
              onFocus={() => setIsLocalityFocused(true)}
            />
            {isLocalityFocused && filteredLocalities.length > 0 && (
              <ul className={styles.suggestions}>
                {filteredLocalities.map((l) => (
                  <li
                    key={l}
                    className={`${styles.suggestionItem} ${l === area ? styles.selectedItem : ''
                      }`}
                    onMouseDown={() => handleLocalitySelect(l)}
                  >
                    {l}
                  </li>
                ))}
              </ul>
            )}
            {isLocalityFocused &&
              city &&
              filteredLocalities.length === 0 && (
                <div className={styles.noResults}>
                  No localities found — type to add custom
                </div>
              )}
          </div>
        </div>

        {/* ── Full Address ── */}
        <div className={styles.field}>
          <label>
            Full Address <span className={styles.req}>*</span>
          </label>
          <textarea
            value={address}
            required
            onChange={(event) => handleAddressChange(event.target.value)}
          />
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          className={styles.locBtn}
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className={styles.locBtn}
          type="button"
          onClick={useMyLocation}
        >
          Use My Current Location
        </button>
      </div>

      <div className={styles.mapWrap}>
        <Map
          lat={position.lat}
          lng={position.lng}
          onMapClick={handleMapClick}
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