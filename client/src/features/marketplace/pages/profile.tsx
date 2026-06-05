import React, { useState } from 'react';
import Sidebar from '../components/profile/Sidebar';
import TopHeader from '../components/profile/TopHeader';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfilePerformanceCard from '../components/profile/ProfilePerformanceCard';
import QuickActionsCard from '../components/profile/QuickActionsCard';



const ProfilePage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const bannerStats = [
    {
      label: 'Total Listings',
      value: '45',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" />
        </svg>
      ),
    },
    {
      label: 'Sold/Rented',
      value: '127',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" />
        </svg>
      ),
    },
    {
      label: 'Rating',
      value: '4.8/5',
      subValue: '(89 reviews)',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      label: 'Profile Views',
      value: '1,234',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeMenu} onItemClick={setActiveMenu} />
      <TopHeader userName="Ahmed Malik" notificationCount={0} />

      {/* Right Sidebar */}
      <aside className="w-[290px] fixed right-0 top-[64px] bottom-0 overflow-y-auto bg-gray-50 p-4 space-y-3 z-10">
        <ProfilePerformanceCard
          percentage={95}
          verifications={['Identity Verified', 'Phone Verified', 'Email Verified', 'Business Verified']}
        />
        <QuickActionsCard />
      </aside>

      {/* Main Content */}
      <main className="ml-[230px] mr-[290px] pt-[64px]">
        <div className="p-5 space-y-4">
          <ProfileBanner
            name="Ahmed Malik"
            title="Verified Real Estate Seller"
            company="Malik Properties"
            location="Lahore, Pakistan"
            joinDate="March 2023"
            badge="Top Seller"
            about="Experienced real estate professional specializing in residential and commercial properties. Helping clients find their perfect property with trust and transparency."
            specializations="Residential | Commercial"
            languages="Urdu, English, Punjabi"
            workingHours="9 AM - 8 PM"
            stats={bannerStats}
            verifications={['Identity Verified', 'Phone Verified', 'Email Verified', 'Business Verified']}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            <div className="space-y-4 min-w-0"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;