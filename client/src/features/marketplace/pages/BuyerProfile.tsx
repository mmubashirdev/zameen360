import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerSidebar from '../components/profile/BuyerSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import BuyerProfileBanner from '../components/profile/BuyerProfileBanner';

const BuyerProfile: React.FC = () => {
  const navigate = useNavigate();

  // ⭐ Auto-redirect if user is SELLER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
    const userRole = String(storedUser.role || '').toUpperCase();

    if (!localStorage.getItem('zameen360_token')) {
      navigate('/login');
      return;
    }

    if (userRole === 'SELLER') {
      console.log('🔄 Seller detected on buyer profile, redirecting to /profile');
      navigate('/profile', { replace: true });
      return;
    }

    if (userRole === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
  }, [navigate]);

  // Don't render if user is not BUYER
  const storedUser = JSON.parse(localStorage.getItem('zameen360_user') || '{}');
  const userRole = String(storedUser.role || '').toUpperCase();
  
  if (userRole !== 'BUYER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <BuyerSidebar />

      <main className="ml-[224px] mr-[20px] pt-[80px]">
        <div className="p-5 space-y-4">
          <BuyerProfileBanner />
        </div>
      </main>
    </div>
  );
};

export default BuyerProfile;