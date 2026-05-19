// src/features/marketplace/components/property-details/overview/PropertyOverview.tsx
import {
  MapPin,
  Bed,
  Bath,
  Sofa,
  UtensilsCrossed,
  Maximize,
  Car,
} from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const iconMap: Record<string, React.ReactNode> = {
  bed: <Bed size={20} />,
  bath: <Bath size={20} />,
  sofa: <Sofa size={20} />,
  kitchen: <UtensilsCrossed size={20} />,
  area: <Maximize size={20} />,
  car: <Car size={20} />,
};

const badgeStyles: Record<string, string> = {
  "For Sale": "bg-blue-600 text-white",
  Featured: "bg-green-500 text-white",
  Premium: "bg-orange-400 text-white",
  Verified: "bg-blue-100 text-blue-600",
};

const PropertyOverview = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        {propertyData.title}
      </h1>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm">{propertyData.location}</span>
          <a href="#map" className="text-blue-600 text-sm hover:underline ml-2">
            View on Map
          </a>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {propertyData.price}
          </div>
          <div className="flex items-center gap-2 justify-end text-sm">
            <span className="text-gray-500">{propertyData.priceInWords}</span>
            <a href="#" className="text-blue-600 hover:underline">
              Price Insights
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {propertyData.badges.map((badge) => (
          <span
            key={badge}
            className={`mb-4 px-3 py-1 rounded text-xs font-medium ${badgeStyles[badge] || "bg-gray-100 text-gray-700"}`}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 border border-gray-200 shadow-lg mb-4 rounded-xl p-4">
        {propertyData.features.map((feature) => (
          <div
            key={feature.label}
            className="flex flex-col items-center text-center"
          >
            <div className="text-blue-600 mb-1">{iconMap[feature.icon]}</div>
            <div className="font-semibold text-gray-900">{feature.value}</div>
            <div className="text-xs text-gray-500">{feature.label}</div>
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          DESCRIPTION
        </h2>
        <div className="space-y-2 text-sm text-gray-600 leading-relaxed mb-4">
          {propertyData.description.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
