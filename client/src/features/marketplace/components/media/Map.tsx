import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MapProps {
  lat: number;
  lng: number;
  onMapClick?: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const defaultMapOptions = {
  zoom: 16,
  mapTypeControl: true,
  fullscreenControl: true,
  streetViewControl: true,
  zoomControl: true,
};

const Map: React.FC<MapProps> = ({ lat, lng, onMapClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    setMarkerPosition({ lat, lng });
  }, [lat, lng]);

  const handleMapClick = (event: any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    onMapClick?.(newLat, newLng);
  };

  if (!apiKey) {
    return (
      <div style={{ ...mapContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <p style={{ color: '#666', textAlign: 'center' }}>
          Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to .env.local
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: markerPosition.lat, lng: markerPosition.lng }}
        zoom={16}
        onClick={handleMapClick}
        options={defaultMapOptions}
        ref={mapRef}
      >
        <Marker
          position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
          onClick={() => setShowInfo(!showInfo)}
          draggable={true}
          onDragEnd={(event) => {
            const newLat = event.latLng?.lat() || markerPosition.lat;
            const newLng = event.latLng?.lng() || markerPosition.lng;
            setMarkerPosition({ lat: newLat, lng: newLng });
            onMapClick?.(newLat, newLng);
          }}
        >
          {showInfo && (
            <InfoWindow
              position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
              onCloseClick={() => setShowInfo(false)}
            >
              <div style={{ color: '#000', padding: '8px', fontSize: '12px' }}>
                <strong>Property Location</strong>
                <p>Lat: {markerPosition.lat.toFixed(4)}</p>
                <p>Lng: {markerPosition.lng.toFixed(4)}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
