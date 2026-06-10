import { MapPin, Bed, Bath, Maximize, Calendar } from "lucide-react";

interface Props {
  title: string | null;
  purpose: string | null;
  propertyType: string | null;
  price: string | null;
  monthlyRent: string | null;
  negotiable: boolean;
  city: string | null;
  locality: string | null;
  address: string | null;
  description: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  areaSize: string | null;
  areaUnit: string | null;
  createdAt: string;
}

const formatPrice = (price: string | null) => {
  if (!price) return "N/A";
  const num = Number(price);
  if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `PKR ${(num / 100000).toFixed(2)} Lac`;
  return `PKR ${num.toLocaleString()}`;
};

const PropertyOverview = ({
  title, purpose, propertyType, price, monthlyRent, negotiable,
  city, locality, address, description, bedrooms, bathrooms,
  areaSize, areaUnit, createdAt,
}: Props) => {
  const isRent = purpose?.toLowerCase() === "rent";
  const displayPrice = isRent ? formatPrice(monthlyRent) : formatPrice(price);

  return (
    <div className="space-y-4">
      {/* Title & Tags */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {purpose && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                For {purpose}
              </span>
            )}
            {propertyType && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                {propertyType}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title || "Untitled Property"}
          </h1>
          <div className="flex items-center gap-1 text-gray-500 mt-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {[address, locality, city].filter(Boolean).join(", ") || "Location not specified"}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{displayPrice}</div>
          {isRent && <div className="text-xs text-gray-500">per month</div>}
          {negotiable && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
              Negotiable
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
        {bedrooms && (
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Bedrooms</div>
              <div className="font-semibold">{bedrooms}</div>
            </div>
          </div>
        )}
        {bathrooms && (
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Bathrooms</div>
              <div className="font-semibold">{bathrooms}</div>
            </div>
          </div>
        )}
        {areaSize && (
          <div className="flex items-center gap-2">
            <Maximize className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Area</div>
              <div className="font-semibold">{areaSize} {areaUnit}</div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Listed</div>
            <div className="font-semibold text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
      )}
    </div>
  );
};

export default PropertyOverview;