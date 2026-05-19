// src/features/marketplace/components/property-details/amenities/AmenitiesList.tsx
import { CheckCircle2 } from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const AmenitiesList = () => {
  return (
    <div className="border-t pt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">AMENITIES</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {propertyData.amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesList;
