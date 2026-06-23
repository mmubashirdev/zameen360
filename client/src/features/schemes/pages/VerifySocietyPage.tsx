import DashboardNavbar from "@features/marketplace/components/DashboardNavbar";
import Footer from "@features/marketplace/components/Footer";
import VerifySocietyForm from "../components/VerifySocietyForm";

const VerifySocietyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Housing Society</h1>
          <p className="mt-2 text-sm text-gray-600">
            Submit housing society details and documents for admin review.
          </p>
        </div>
        <VerifySocietyForm />
      </main>
      <Footer />
    </div>
  );
};

export default VerifySocietyPage;
