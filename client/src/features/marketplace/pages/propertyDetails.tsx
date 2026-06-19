import PropertyGallery from "../components/property-details/gallery/PropertyGallery";
import PropertyOverview from "../components/property-details/overview/PropertyOverview";
import AmenitiesList from "../components/property-details/amenities/AmenitiesList";
import FloorPlans from "../components/property-details/floorplans/FloorPlans";
import LocationMap from "../components/property-details/location/LocationMap";
import ReviewsSection from "../components/property-details/reviews/ReviewsSection";
import AgentCard from "../components/property-details/agent/AgentCard";
import DashboardNavbar from "../components/DashboardNavbar";
import SpecificationsTable from "../components/property-details/specifications/SpecificationsTable";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/property-details/shared/BreadCrumbs";
import MortgageCalculator from "../components/property-details/shared/LoanCalculator";
import ActionsCard from "../components/property-details/shared/ActionCards";
import SafetyTips from "../components/property-details/shared/SafetyTips";
import VirtualTour from "../components/property-details/shared/VirtualTour";
import RecentlyViewed from "../components/property-details/shared/RecentlyViewed";

const PropertyDetails = () => {
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
            Take 3D Virtual Tour
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6 ">
            <PropertyGallery />
            <PropertyOverview />
            <AmenitiesList />
            <SpecificationsTable />
            <FloorPlans />
            <LocationMap />
            <VirtualTour />
            <RecentlyViewed />
            <ReviewsSection />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            <AgentCard />
            <MortgageCalculator />
            <ActionsCard />
            <SafetyTips />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
