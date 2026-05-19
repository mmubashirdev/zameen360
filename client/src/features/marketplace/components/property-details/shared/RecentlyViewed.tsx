// src/features/marketplace/components/property-details/shared/RecentlyViewed.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const RecentlyViewed = () => {
  return (
    <div className="border-t pt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        RECENTLY VIEWED
      </h2>
      <div className="relative">
        <button className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-1.5 shadow hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {propertyData.recentlyViewed.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">{item.location}</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-1.5 shadow hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RecentlyViewed;
