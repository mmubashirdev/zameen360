// src/features/marketplace/components/property-details/location/LocationMap.tsx
import {
  MapPin,
  TreePine,
  Building2,
  GraduationCap,
  ShoppingBag,
  Plane,
} from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const iconMap: Record<string, React.ReactNode> = {
  park: <TreePine size={18} className="text-green-600" />,
  masjid: <Building2 size={18} className="text-blue-600" />,
  school: <GraduationCap size={18} className="text-red-500" />,
  mall: <ShoppingBag size={18} className="text-orange-500" />,
  airport: <Plane size={18} className="text-blue-500" />,
};

const LocationMap = () => {
  return (
    <div className="border-t pt-6" id="map">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        LOCATION & NEARBY PLACES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Map placeholder */}
        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden border">
          <img
            src="https://maps.googleapis.com/maps/api/staticmap?center=Lahore,Pakistan&zoom=14&size=600x400"
            alt="map"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/600x400/e5e7eb/9ca3af?text=Map+View";
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin size={32} className="text-blue-600 fill-blue-600" />
          </div>
        </div>

        {/* Nearby places */}
        <div className="space-y-3">
          {propertyData.nearbyPlaces.map((place) => (
            <div
              key={place.place}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                {iconMap[place.icon] || <MapPin size={18} />}
                <span className="text-gray-700">{place.place}</span>
              </div>
              <span className="text-gray-500">{place.distance}</span>
            </div>
          ))}
          <a
            href="#"
            className="text-blue-600 text-sm hover:underline inline-block mt-2"
          >
            View More Nearby Places
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
