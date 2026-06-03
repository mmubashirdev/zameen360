// Rejected.tsx
import React from 'react';
import AdminListingsTable from './components/AdminListingsTable';

const Rejected: React.FC = () => {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Rejected Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          These listings were rejected and are not visible to buyers.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
        <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-red-600">
          These listings are <strong>hidden from the public</strong>. You can move them back to
          "Re-review" if you'd like to reconsider.
        </p>
      </div>

      <AdminListingsTable status="rejected" />
    </div>
  );
};

export default Rejected;
