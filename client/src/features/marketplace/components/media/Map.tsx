import React, { useCallback, useState, useEffect } from 'react';

interface MapProps {
  lat: number;
  lng: number;
  onMapClick?: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Simple fallback map component - can be replaced with actual Google Maps later
const Map: React.FC<MapProps> = ({ lat, lng, onMapClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!apiKey) {
    return (
      <div style={{ ...mapContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <p style={{ color: '#666', textAlign: 'center' }}>
          Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to .env.local
        </p>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div style={{ ...mapContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }}>
        <p style={{ color: '#666' }}>Loading map...</p>
      </div>
    );
  }

  // Embedded map using a simple iframe or placeholder
  return (
    <div
      style={{
        ...mapContainerStyle,
        backgroundColor: '#e8eaed',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const clickLat = lat + (Math.random() - 0.5) * 0.01;
        const clickLng = lng + (Math.random() - 0.5) * 0.01;
        if (onMapClick) {
          onMapClick(clickLat, clickLng);
        }
      }}
    >
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
        }}
        title="Google Maps"
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.4812356489446!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}%2C${lng}!5e0!3m2!1sen!2s!4v1234567890`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default Map;
