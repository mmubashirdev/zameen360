// src/features/marketplace/components/property-details/amenities/AmenitiesList.tsx
import { Check } from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const AmenitiesList = () => {
  return (
    <div className="border-t border-t-gray-200 mb-4 pt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">AMENITIES</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {propertyData.amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <Check size={18} className="bg-blue-600 text-white p-1 rounded-full shrink-0" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesList;
