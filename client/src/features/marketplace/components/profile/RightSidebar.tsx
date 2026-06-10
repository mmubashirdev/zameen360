import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-[280px] fixed right-0 top-[64px] bottom-0 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {/* Profile Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-[14px] font-bold text-gray-900 mb-3">Profile Performance</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="5" />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * 0.05}
                transform="rotate(-90 32 32)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[13px] font-bold text-gray-900">95%</span>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-800">Profile Completion</p>
            <p className="text-[11px] text-green-600 font-medium">Excellent!</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '95%' }} />
        </div>

        <div className="space-y-2">
          {['Identity Verified', 'Phone Verified', 'Email Verified', 'Business Verified'].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[12px] text-gray-700">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-[14px] font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;