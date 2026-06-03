import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onItemClick }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" />
        </svg>
      ),
    },
    {
      id: 'listings',
      label: 'My Listings',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 12h.01M9 15h.01M15 9h.01M15 12h.01M15 15h.01" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-5" />
        </svg>
      ),
    },
    {
      id: 'leads',
      label: 'Leads & Inquiries',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'visit',
      label: 'Visit Schedule',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'Messages',
      badge: 12,
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
      ),
    },
    {
      id: 'earnings',
      label: 'Earnings & Payments',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.5c-.5-1-1.5-1.5-3-1.5-2 0-3 1-3 2s1 1.5 3 2 3 1 3 2-1 2-3 2-2.5-.5-3-1.5M12 6.5v11" />
        </svg>
      ),
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[230px] bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-30">
      {/* Logo */}
      <div className="h-[64px] px-5 flex items-center gap-2 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
          </svg>
        </div>
        <span className="text-[18px] font-bold text-gray-900">Zameen 360</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold min-w-[20px] h-[18px] px-1.5 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;