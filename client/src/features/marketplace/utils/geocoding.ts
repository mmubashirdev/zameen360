import { ALL_CITY_NAMES, getLocalitiesForCity } from '../constants/pakistanLocations';
import axiosInstance from '../../../shared/lib/axios';

export const reverseGeocodeLatLng = async (
  lat: number, 
  lng: number, 
  fallbackCity: string = '', 
  fallbackLocality: string = '', 
  fallbackAddress: string = ''
) => {
  try {
    const data = await axiosInstance.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    if (data && data.address) {
      const addr = data.address;
      
      // Match City
      const possibleCityNames = [
        addr.city, addr.town, addr.municipality, addr.county, addr.state_district, addr.village
      ].filter(Boolean);
      
      let matchedCity = fallbackCity; 
      for (const name of possibleCityNames) {
        const match = ALL_CITY_NAMES.find(
          c => c.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(c.toLowerCase())
        );
        if (match) {
          matchedCity = match;
          break;
        }
      }
      if (!ALL_CITY_NAMES.includes(matchedCity) && possibleCityNames.length > 0) {
         matchedCity = possibleCityNames[0];
      }

      // Match Area
      const possibleAreaNames = [
        addr.suburb, addr.neighbourhood, addr.residential, addr.commercial
      ].filter(Boolean);
      
      let matchedArea = possibleAreaNames.length > 0 ? possibleAreaNames[0] : fallbackLocality;
      if (ALL_CITY_NAMES.includes(matchedCity)) {
        const localities = getLocalitiesForCity(matchedCity);
        for (const name of possibleAreaNames) {
          const match = localities.find(
            l => l.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(l.toLowerCase())
          );
          if (match) {
            matchedArea = match;
            break;
          }
        }
      }

      const fullAddress = data.display_name || fallbackAddress;

      return {
        city: matchedCity,
        locality: matchedArea,
        address: fullAddress,
        lat,
        lng
      };
    }
  } catch (e) {
    console.error('Reverse geocoding error', e);
  }
  return null;
};
