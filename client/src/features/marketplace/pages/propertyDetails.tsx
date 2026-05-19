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

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs />

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
