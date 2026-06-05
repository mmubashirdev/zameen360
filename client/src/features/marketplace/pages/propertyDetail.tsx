// src/pages/propertyDetails.tsx
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
import SafetyTips from "../components/shared/SafetyTIps";
import VirtualTour from "../components/shared/VirtualTour.tsx";
import RecentlyViewed from "../components/shared/RecentlyViewed";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = usePropertyDetails(id);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Skeleton */}
            <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6">
              {/* Gallery Skeleton */}
              <div className="w-full h-80 bg-gray-200 rounded-xl animate-pulse" />
              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
              {/* Content Skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>
              ))}
            </div>
            {/* Right Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 space-y-3 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm max-w-md mx-auto">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center 
                            justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
                     2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
                     0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg 
                           text-gray-700 hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/marketplace")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition"
              >
                Browse Properties
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== NO DATA STATE ====================
  if (!property) return null;

  // ==================== MAIN RENDER ====================
  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs ko property data pass karo */}
        <Breadcrumbs
          city={property.city}
          propertyType={property.propertyType}
          title={property.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================== LEFT SIDE ==================== */}
          <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6">
            {/* Gallery - images array pass karo */}
            <PropertyGallery
              images={property.images}
              title={property.title}
            />

            {/* Overview - basic details */}
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

            {/* Amenities */}
            <AmenitiesList amenities={property.amenities} />

            {/* Specifications */}
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

            {/* Floor Plans */}
            <FloorPlans
              floorPlan={property.floorPlan}
              title={property.title}
            />

            {/* Location Map */}
            <LocationMap
              address={property.address}
              city={property.city}
              locality={property.locality}
            />

            {/* Virtual Tour */}
            <VirtualTour videoUrl={property.videoUrl} />

            {/* Recently Viewed */}
            <RecentlyViewed currentPropertyId={property.id} />

            {/* Reviews */}
            <ReviewsSection propertyId={property.id} />
          </div>

          {/* ==================== RIGHT SIDEBAR ==================== */}
          <div className="space-y-4">
            {/* Agent/Seller Info */}
            <AgentCard
              
              user={property.user}
              propertyId={property.id}
            />

            {/* Mortgage Calculator */}
            <MortgageCalculator
              propertyPrice={property.price}
              downPayment={property.downPayment}
            />

            {/* Actions - Save, Share, Report */}
            <ActionsCard
              propertyId={property.id}
              title={property.title}
            />

            {/* Safety Tips */}
            <SafetyTips />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;