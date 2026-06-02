import PropertyList from "./components/PropertyList";

function Rejected() {
  return (
    <PropertyList
      statusFilter="rejected"
      title="Rejected Listings"
      subtitle="All rejected property listings"
    />
  );
}

export default Rejected;