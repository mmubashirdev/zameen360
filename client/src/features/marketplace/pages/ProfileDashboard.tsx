import React from 'react';
import Sidebar from '../components/profile/Sidebar';
import TopHeader from '../components/profile/TopHeader';
import ProfileBanner from '../components/profile/ProfileBanner';
import RightSidebar from '../components/profile/RightSidebar';

const ProfileDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader />
      <RightSidebar />

      <main className="ml-[220px] mr-[280px] pt-[64px]">
        <div className="p-5">
          <ProfileBanner />
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;