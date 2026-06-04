// src/components/PasswordInput.jsx
import { useState } from "react";
import type { ChangeEvent } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordInput = ({ value, onChange, error }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`w-full px-4 py-3 pr-12 rounded-xl border ${
            error
              ? "border-red-400 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-gray-900 focus:border-gray-900"
          } outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white focus:ring-2`}
        />
        {/* Eye Toggle Button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            // Eye Off Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243l2.829 2.829M6.343 6.343l11.314 11.314M14.121 14.121A3 3 0 009.879 9.879"
              />
            </svg>
          ) : (
            // Eye Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
