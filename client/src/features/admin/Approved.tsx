// Approved.tsx
import React from 'react';
import AdminListingsTable from './components/AdminListingsTable';

const Approved: React.FC = () => {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Approved Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          These listings are live and visible to buyers on the Buy page.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6">
        <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-emerald-700">
          All listings below are <strong>publicly visible</strong> on the Buy page.
          You can reject any listing to remove it from public view.
        </p>
      </div>

      <AdminListingsTable status="approved" />
    </div>
  );
};

export default Approved;
