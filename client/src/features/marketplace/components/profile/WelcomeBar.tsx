import React from 'react';
import { useUser } from './UserContext';

interface WelcomeBarProps {
  date: string;
  newInquiries?: number;
}

const WelcomeBar: React.FC<WelcomeBarProps> = ({ date, newInquiries = 5 }) => {
  const { user } = useUser();
  const firstName = user.name.split(' ')[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-[17px] font-bold text-gray-900 flex items-center gap-2">
          Welcome back, {firstName}! <span className="text-xl">👋</span>
        </h2>
        <p className="text-[12.5px] text-gray-500 mt-0.5">Here's your business overview</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-medium px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Property
        </button>
        <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-[12.5px] font-medium px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Inquiries ({newInquiries} new)
        </button>
      </div>
    </div>
  );
};

export default WelcomeBar;