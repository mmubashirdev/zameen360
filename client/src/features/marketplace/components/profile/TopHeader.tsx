import React from 'react';

interface TopHeaderProps {
  userName: string;
  notificationCount?: number;
}

const TopHeader: React.FC<TopHeaderProps> = ({ userName, notificationCount = 5 }) => {
  const navLinks = ['Explore', 'Properties', 'Agents', 'Projects', 'Blog'];

  return (
    <header className="h-[64px] bg-white border-b border-gray-200 fixed top-0 left-[230px] right-0 z-20 flex items-center px-6 gap-6">
      {/* Search */}
      <div className="flex-1 max-w-[420px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties, locations, or keywords..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 h-10 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="hidden lg:flex items-center gap-6 ml-2">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13.5px] text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        {/* Post Property Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium px-4 h-10 rounded-lg transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Post Property
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {userName.charAt(0)}
          </div>
          <span className="text-[13.5px] font-semibold text-gray-800">{userName}</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;