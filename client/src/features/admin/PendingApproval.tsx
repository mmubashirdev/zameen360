// PendingApproval.tsx
import React from 'react';
import AdminListingsTable from './components/AdminListingsTable';

const PendingApproval: React.FC = () => {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Pending Approval</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review new property submissions and approve or reject them.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-amber-700">
          Approving a listing will make it <strong>publicly visible</strong> on the Buy page immediately.
          Rejecting it will remove it from the public listings.
        </p>
      </div>

      <AdminListingsTable status="pending" />
    </div>
  );
};

export default PendingApproval;
