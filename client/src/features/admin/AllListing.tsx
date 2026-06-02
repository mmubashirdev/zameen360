import PropertyList from "./components/PropertyList";

function AllListings() {
  return (
    <PropertyList
      statusFilter="all"
      title="All Listings"
      subtitle="View all property listings"
    />
  );
}

export default AllListings;