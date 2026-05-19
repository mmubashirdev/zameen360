// src/features/marketplace/components/property-details/gallery/PropertyGallery.tsx
import { Heart, Maximize2, Box } from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const PropertyGallery = () => {
  return (
    <div className="space-y-3">
      {/* MAIN IMAGE */}
      <div className="relative">
        <img
          src={propertyData.images[0]}
          alt="property"
          className="w-full h-105 object-cover rounded-2xl"
        />

        <button className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Box size={16} />
          3D TOUR
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-50">
            <Heart size={18} className="text-gray-700" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-50">
            <Maximize2 size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-5 gap-3 mt-2">
        {propertyData.images.slice(0, 4).map((image, index) => (
          <img
            key={index}
            src={image}
            alt="thumbnail"
            className="h-20 w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
          />
        ))}
        <div className="relative h-20 w-full rounded-lg cursor-pointer overflow-hidden">
          <img
            src={propertyData.images[0]}
            alt="more"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
            +25 Photos
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;
