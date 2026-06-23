
import DashboardNavbar from '@features/marketplace/components/DashboardNavbar';
import Footer from '@features/marketplace/components/Footer';
import Schemes  from '../components/Schemes';

const SchemesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Schemes />
      <Footer />
    </div>
  );
};

export default SchemesPage;