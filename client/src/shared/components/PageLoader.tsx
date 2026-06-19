import Loader from "./Loader";

interface PageLoaderProps {
  message?: string;
}

const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      {/* Logo */}
      <div className="inline-flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">Z</span>
        </div>
        <span className="text-xl font-bold text-gray-800">
          Zameen<span className="text-blue-600">360</span>
        </span>
      </div>

      <Loader size="lg" variant="spinner" message={message} />
    </div>
  </div>
);

export default PageLoader;
