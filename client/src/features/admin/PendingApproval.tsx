import PropertyList from "./components/PropertyList";

function PendingApproval() {
  return (
    <PropertyList
      statusFilter="pending"
      title="Pending Approvals"
      subtitle="Review and approve property listings"
    />
  );
}

export default PendingApproval;