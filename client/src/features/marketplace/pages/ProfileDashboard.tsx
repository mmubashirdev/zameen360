import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/profile/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import ProfileBanner from '../components/profile/ProfileBanner';
import RightSidebar from '../components/profile/RightSidebar';

const ProfileDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Auto-redirect based on role
  useEffect(() => {
    const token = localStorage.getItem('zameen360_token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
    const userRole = String(storedUser.role || '').toUpperCase();

    if (userRole === 'BUYER') {
      console.log('🔄 Buyer detected on seller profile, redirecting to /buyer-profile');
      navigate('/buyer-profile', { replace: true });
      return;
    }

    if (userRole === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
  }, [navigate]);

  // Don't render if user is not SELLER
  const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
  const userRole = String(storedUser.role || '').toUpperCase();

  if (userRole !== 'SELLER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Sidebar />
      <RightSidebar />

      <main className="ml-[224px] mr-[280px] pt-[80px]">
        <div className="p-5">
          <ProfileBanner />
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;