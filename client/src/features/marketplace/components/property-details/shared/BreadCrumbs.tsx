// src/features/marketplace/components/property-details/shared/Breadcrumbs.tsx
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const items = [
    "Home",
    "Buy",
    "Lahore",
    "DHA Lahore",
    "Phase 6",
    "House",
    "1 Kanal Modern House",
  ];

  return (
    <nav className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-4">
      {items.map((item, idx) => (
        <div key={item} className="flex items-center gap-1">
          <a
            href="#"
            className={`hover:text-blue-600 ${
              idx === items.length - 1 ? "text-gray-700 font-medium" : ""
            }`}
          >
            {item}
          </a>
          {idx < items.length - 1 && <ChevronRight size={12} />}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
