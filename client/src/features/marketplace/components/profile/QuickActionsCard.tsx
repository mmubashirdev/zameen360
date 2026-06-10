import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-[13.5px] font-bold text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <button
          onClick={() => navigate('/post-property')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>
        <button
          onClick={() => navigate('/my-listings')}
          className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-[12.5px] font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Boost Listing
        </button>
        <button
          onClick={() => navigate('/upgrade-plan')}
          className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-[12.5px] font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11M5 16h14M5 16l1 4h12l1-4" />
          </svg>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default QuickActionsCard;