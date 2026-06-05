import React from 'react';

interface Props {
  managerName: string;
  managerRole: string;
  phone: string;
  email: string;
}

const SupportCenterCard: React.FC<Props> = ({ managerName, managerRole, phone, email }) => {
  const links = [
    {
      label: 'Help Center',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" />
        </svg>
      ),
    },
    {
      label: 'Video Tutorials',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M10 9l5 3-5 3z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Seller Community',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-[13.5px] font-bold text-gray-900 mb-3">Support Center</h3>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {managerName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-blue-600 font-medium">{managerRole}</p>
          <p className="text-[12.5px] font-semibold text-gray-800">{managerName}</p>
          <p className="text-[10.5px] text-gray-500">{phone}</p>
          <p className="text-[10.5px] text-gray-500 truncate">{email}</p>
        </div>
      </div>

      <button className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-[12.5px] font-medium py-2.5 rounded-lg transition-colors mb-3">
        Contact Support
      </button>

      <div className="space-y-2.5 pt-1 border-t border-gray-100">
        {links.map((l, i) => (
          <a key={i} href="#" className="flex items-center gap-2 text-[12px] text-gray-700 hover:text-blue-600 transition-colors pt-1">
            <span className="text-blue-500">{l.icon}</span>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SupportCenterCard;