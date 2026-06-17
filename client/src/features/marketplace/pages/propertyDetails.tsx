// client/src/features/marketplace/pages/propertyDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import usePropertyDetails from "../components/context/usePropertyDetail";
import PropertyGallery from "../components/gallery/PropertyGallery";
import PropertyOverview from "../components/overview/PropertyOverview";
import AmenitiesList from "../components/aminities/AmenitiesList";
import FloorPlans from "../components/floorplans/FloorPlans";
import LocationMap from "../components/location/LocationMap";
import ReviewsSection from "../components/reviews/ReviewsSection";
import AgentCard from "../components/agent/AgentCard";
import DashboardNavbar from "../components/DashboardNavbar";
import SpecificationsTable from "../components/specifications/SpecificationsTable";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/shared/BreadCrumbs";
import MortgageCalculator from "../components/shared/LoanCalculator";
import ActionsCard from "../components/shared/ActionCards";
import SafetyTips from "../components/shared/SafetyTips";
import RecentlyViewed from "../components/shared/RecentlyViewed";
import type { PanoramaRoom } from "../components/shared/VirtualTour";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = usePropertyDetails(id);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6">
              <div className="w-full h-80 bg-gray-200 rounded-xl animate-pulse" />
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 space-y-3 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded-lg w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/marketplace")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Properties
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) return null;

  // ✅ Map panoramas - safely handle missing property
  const panoramaRooms: PanoramaRoom[] = (
    (property as any)?.panoramas || []
  ).map((p: any) => ({
    roomName: p.roomName,
    imageUrl: p.imageUrl,
    hotspots: p.hotspots || [],
  }));

  const hasTour = panoramaRooms.length > 0;

  const launchVirtualTour = () => {
    navigate(`/property/${property.id}/virtual-tour`, {
      state: {
        panoramas: panoramaRooms,
        propertyTitle: property.title,
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNavbar />

      {/* pt-20 pushes content below the fixed navbar (~80px height) */}
      <main className="max-w-7xl mx-auto px-4 pb-6 pt-20 mt-5">
        {/* Breadcrumbs + Virtual Tour Button */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <Breadcrumbs
            city={property.city}
            propertyType={property.propertyType}
            title={property.title}
          />

          {/* 🌐 Virtual Tour Button */}
          <button
            onClick={launchVirtualTour}
            disabled={!hasTour}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md transition-all ${
              hasTour
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg cursor-pointer"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            title={
              hasTour
                ? "View 360° Virtual Tour"
                : "Virtual tour not available for this property"
            }
          >
            🌐 Take 360° Virtual Tour
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================== LEFT SIDE ==================== */}
          <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6">
            <PropertyGallery images={property.images} title={property.title} />

            <PropertyOverview
              title={property.title}
              purpose={property.purpose}
              propertyType={property.propertyType}
              price={property.price}
              monthlyRent={property.monthlyRent}
              negotiable={property.negotiable}
              city={property.city}
              locality={property.locality}
              address={property.address}
              description={property.description}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaSize={property.areaSize}
              areaUnit={property.areaUnit}
              createdAt={property.createdAt}
            />

            <AmenitiesList amenities={property.amenities} />

            <SpecificationsTable
              areaSize={property.areaSize}
              areaUnit={property.areaUnit}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              floors={property.floors}
              parking={property.parking}
              yearBuilt={property.yearBuilt}
              furnishing={property.furnishing}
              possession={property.possession}
              facing={property.facing}
              purpose={property.purpose}
              propertyType={property.propertyType}
            />

            <FloorPlans floorPlan={property.floorPlan} title={property.title} />
            <LocationMap
              address={property.address}
              city={property.city}
              locality={property.locality}
            />
            <RecentlyViewed currentPropertyId={property.id} />
            <ReviewsSection propertyId={property.id} />
          </div>

          {/* ==================== RIGHT SIDEBAR ==================== */}
          <div className="space-y-4">
            <AgentCard user={property.user} propertyId={property.id} />
            <MortgageCalculator
              propertyPrice={property.price}
              downPayment={property.downPayment}
            />
            <ActionsCard propertyId={property.id} title={property.title} />
            <SafetyTips />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
