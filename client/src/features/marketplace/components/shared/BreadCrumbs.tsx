// components/property-details/shared/BreadCrumbs.tsx
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  city: string | null;
  propertyType: string | null;
  title: string | null;
}

const BreadCrumbs = ({ city, propertyType, title }: Props) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
      <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
      {city && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span>{city}</span>
        </>
      )}
      {propertyType && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span>{propertyType}</span>
        </>
      )}
      {title && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
        </>
      )}
    </nav>
  );
};

export default BreadCrumbs;