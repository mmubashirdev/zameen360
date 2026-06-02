import PropertyList from "./components/PropertyList";

function Approved() {
  return (
    <PropertyList
      statusFilter="approved"
      title="Approved Listings"
      subtitle="All approved property listings"
    />
  );
}

export default Approved;