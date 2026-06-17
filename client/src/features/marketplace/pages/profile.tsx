import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@features/auth/hooks/useAuth';
import Sidebar from '../components/profile/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfilePerformanceCard from '../components/profile/ProfilePerformanceCard';
import QuickActionsCard from '../components/profile/QuickActionsCard';
import SellerProperties from '../components/profile/SellerProperties';



const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const userRole = String(user.role || '').toUpperCase();

    if (userRole === 'BUYER') {
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

      {/* Right Sidebar */}
      <aside className="w-72.5 fixed right-0 top-17 bottom-0 overflow-y-auto bg-gray-50 p-4 space-y-3 z-10">
        <ProfilePerformanceCard
          percentage={95}
          verifications={['Identity Verified', 'Phone Verified', 'Email Verified', 'Business Verified']}
        />
        <QuickActionsCard />
      </aside>

      {/* Main Content */}
      <main className="ml-56 mr-72.5 pt-17">
        <div className="p-5 space-y-4">
          <ProfileBanner />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            <div className="space-y-4 min-w-0">
              <SellerProperties />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;