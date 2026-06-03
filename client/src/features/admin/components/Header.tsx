// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overview of your real estate listings and activity.
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;