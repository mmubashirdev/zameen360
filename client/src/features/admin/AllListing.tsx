// AllListing.tsx
import React from 'react';
import AdminListingsTable from './components/AdminListingsTable';

const AllListings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage every property submission across all statuses.
        </p>
      </div>
      <AdminListingsTable status="all" />
    </div>
  );
};

export default AllListings;
