import Loader from "../Loader";

interface FormLoaderProps {
  message?: string;
  show: boolean;
}

const FormLoader = ({ message = "Saving...", show }: FormLoaderProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 min-w-70">
        <Loader size="lg" variant="spinner" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default FormLoader;
