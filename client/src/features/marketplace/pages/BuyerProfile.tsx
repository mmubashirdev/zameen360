import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@features/auth/hooks/useAuth';
import BuyerSidebar from '../components/profile/BuyerSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import BuyerProfileBanner from '../components/profile/BuyerProfileBanner';

const BuyerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  // ⭐ Auto-redirect if user is SELLER
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const userRole = String(user.role || '').toUpperCase();

    if (userRole === 'SELLER') {
      navigate('/profile', { replace: true });
      return;
    }

    if (userRole === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || String(user.role || '').toUpperCase() !== 'BUYER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <BuyerSidebar />

      <main className="ml-56 mr-5 pt-17">
        <div className="p-5 space-y-4">
          <BuyerProfileBanner />
        </div>
      </main>
    </div>
  );
};

export default BuyerProfile;