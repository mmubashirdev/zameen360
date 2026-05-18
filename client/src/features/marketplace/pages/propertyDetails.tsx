import PropertyGallery from "../components/property-details/gallery/PropertyGallery";
import PropertyOverview from "../components/property-details/overview/PropertyOverview";
import AmenitiesList  from "../components/property-details/amenities/AmenitiesList";
import FloorPlans from "../components/property-details/floorplans/FloorPlans";
import LocationMap from "../components/property-details/location/LocationMap";
import ReviewsSection from "../components/property-details/reviews/ReviewsSection";
import AgentCard from "../components/property-details/agent/AgentCard";
import DashboardNavbar from "../components/DashboardNavbar";
import SpecificationsTable from "../components/property-details/specifications/SpecificationsTable";  
import Footer from "../components/Footer";

const PropertyDetails = () => {
  return (
    <>
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery />
            <PropertyOverview />
            <AmenitiesList />
            <SpecificationsTable />
            <FloorPlans />
            <LocationMap />
            <ReviewsSection />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <AgentCard />
          </div>
        </div>
      </main>
      <h1 className="text-red-500">Property Details</h1>
      <Footer />
    </>
  );
};

export default PropertyDetails;
