import React from 'react';
import { useUser } from './UserContext';

interface Props {
  percentage?: number;
  verifications?: string[];
}

const ProfilePerformanceCard: React.FC<Props> = ({ percentage: propPercentage, verifications: propVerifications }) => {
  const { user, loading } = useUser();

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Dynamic percentage from backend (fallback to prop)
  const percentage = user?.profileCompletion ?? propPercentage ?? 0;

  // Dynamic verifications from backend - Business Verified REMOVED
  const verifications: string[] = [];
  if (user) {
    if (user.verifications?.identity) verifications.push('Identity Verified');
    if (user.verifications?.phone) verifications.push('Phone Verified');
    if (user.verifications?.email) verifications.push('Email Verified');
  } else if (propVerifications) {
    // Fallback - filter out Business Verified
    propVerifications
      .filter((v) => !v.toLowerCase().includes('business'))
      .forEach((v) => verifications.push(v));
  }

  // Completion status text
  const getStatusText = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 70) return { text: 'Good', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'Average', color: 'text-yellow-600' };
    return { text: 'Needs Work', color: 'text-red-600' };
  };

  const status = getStatusText();

  const R = 28;
  const circ = 2 * Math.PI * R;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-[13.5px] font-bold text-gray-900 mb-3">Profile Performance</h3>

      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={R} fill="none" stroke="#E5E7EB" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-bold text-gray-900">{percentage}%</span>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-gray-800">Profile Completion</p>
          <p className={`text-[11px] font-medium ${status.color}`}>{status.text}</p>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>

      <div className="space-y-1.5">
        {verifications.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[11.5px] text-gray-700">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePerformanceCard;