import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@features/auth/hooks/useAuth';
import Sidebar from '../components/profile/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import ProfileBanner from '../components/profile/ProfileBanner';
import RightSidebar from '../components/profile/RightSidebar';

const ProfileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  // Auto-redirect based on role
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const userRole = String(user.role || '').toUpperCase();

    if (userRole === 'BUYER') {
      console.log('🔄 Buyer detected on seller profile, redirecting to /buyer-profile');
      navigate('/buyer-profile', { replace: true });
      return;
    }

    if (userRole === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || String(user.role || '').toUpperCase() !== 'SELLER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Sidebar />
      <RightSidebar />
      
      <main className="ml-56 mr-72.5 pt-17" role="main">
        <div className="p-5">
          <ProfileBanner />
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;