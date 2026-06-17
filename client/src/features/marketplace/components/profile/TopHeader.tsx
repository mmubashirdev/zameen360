import React from 'react';
import { useAuthContext } from '@features/auth/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const TopHeader: React.FC = () => {
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  // Display name - user load nahi hua toh "Guest"
  const displayName = user?.fullName || 'Guest';
  const profilePicture = user?.profilePicture;
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-55 right-0 z-20 flex items-center px-6 gap-6" role="banner">
      {/* Search */}
      <div className="relative w-[320px]">
        <input
          type="text"
          placeholder="Search properties, locations, or keyw"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 h-10 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-7 ml-4">
        {[
          { label: 'Home', path: '/' },
          { label: 'Buy', path: '/buy' },
          { label: 'Rent', path: '/rent' },
          { label: 'Sell', path: '/sell' },
          { label: 'Projects', path: '/projects' },
          { label: 'About Us', path: '/about-us' },
          { label: 'Contact', path: '/contact' },
        ].map((link) => (
          <Link key={link.label} to={link.path} className="text-[14px] text-gray-700 hover:text-blue-600 font-normal">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white" aria-label="notification count">
            5
          </span>
        </button>

        {/* User Profile - DYNAMIC */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden border-2 border-blue-100">
            {profilePicture ? (
              <img src={profilePicture} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{firstLetter}</span>
            )}
          </div>
          <span className="text-[14px] font-semibold text-gray-800">
            {isLoading ? 'Loading...' : displayName}
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;