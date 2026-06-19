import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ButtonLoaderProps {
  loading: boolean;
  children: ReactNode;
  loadingText?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
}

const VARIANTS = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const ButtonLoader = ({
  loading,
  children,
  loadingText = "Please wait...",
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonLoaderProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading || disabled}
    className={`
      px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
      flex items-center justify-center gap-2
      disabled:opacity-60 disabled:cursor-not-allowed
      ${VARIANTS[variant]}
      ${className}
    `}
  >
    {loading ? (
      <>
        <Loader2 size={16} className="animate-spin" />
        {loadingText}
      </>
    ) : (
      children
    )}
  </button>
);

export default ButtonLoader;
