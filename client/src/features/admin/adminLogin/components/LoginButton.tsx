// src/components/LoginButton.jsx
interface LoginButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const LoginButton = ({ onClick, isLoading, disabled }: LoginButtonProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl pb-3.5"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          {/* Loading Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Logging in...</span>
        </div>
      ) : (
        "Log In"
      )}
    </button>
  );
};

export default LoginButton;
