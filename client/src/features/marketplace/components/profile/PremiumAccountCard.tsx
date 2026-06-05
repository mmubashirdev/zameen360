import React from 'react';

const PremiumAccountCard: React.FC = () => {
  const features = ['Featured listings', 'Priority support', 'Advanced analytics', 'Unlimited listings'];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 shadow-sm p-4 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-3xl">👑</div>
      <h3 className="text-[13.5px] font-bold text-gray-900 mb-0.5">Get Premium Account</h3>
      <p className="text-[11px] text-gray-500 mb-3">Unlock premium features</p>

      <div className="space-y-1.5 mb-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[11.5px] text-gray-700">{f}</span>
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-semibold py-2.5 rounded-lg transition-colors">
        Upgrade Now
      </button>
    </div>
  );
};

export default PremiumAccountCard;