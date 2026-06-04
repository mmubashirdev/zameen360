import type { ChangeEvent } from "react";

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const EmailInput = ({ value, onChange, error }: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        Email Address
      </label>

      <input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder="admin@example.com"
        className={`w-full px-4 py-3 rounded-xl border ${
          error
            ? "border-red-400 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-gray-900 focus:border-gray-900"
        } outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white focus:ring-2`}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default EmailInput;
