"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Featured Badge */}
        {property.featured && (
          <span
            className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full"
            style={{ backgroundColor: "#f59e0b" }}
          >
            ⭐ Featured
          </span>
        )}
        {/* Purpose Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white rounded-full ${
            property.purpose === "Rent" ? "bg-blue-600" : "bg-emerald-600"
          }`}
        >
          For {property.purpose}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Price */}
        <p className="text-2xl font-bold text-emerald-700 mb-1">
          {property.priceLabel}
        </p>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {property.title}
        </h3>

        {/* Address */}
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <span>📍</span>
          {property.address}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 border-t border-gray-100 pt-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <span>🛏</span> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <span>🚿</span> {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>📐</span> {property.area.toLocaleString()} sqft
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            {property.type}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#059669" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#047857")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#059669")
            }
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
