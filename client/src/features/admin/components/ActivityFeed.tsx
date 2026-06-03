// components/ActivityFeed.tsx
import React from 'react';

interface ActivityItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

const ActivityFeed: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      icon: (
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      iconBg: 'bg-orange-100',
      title: 'New listing submitted',
      description: '5 Marla House in DHA Phase 6, Lahore',
      time: '10 min ago',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      iconBg: 'bg-green-100',
      title: 'Listing approved',
      description: '1 Kanal House in Bahria Town, Karachi',
      time: '1 hour ago',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      iconBg: 'bg-red-100',
      title: 'Listing rejected',
      description: 'Apartment in Gulberg, Lahore',
      time: '3 hours ago',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      title: 'New user registered',
      description: 'Ali Khan registered as Agent',
      time: '4 hours ago',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      title: 'Listing updated',
      description: '2 Bed Apartment in Clifton, Karachi',
      time: '5 hours ago',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-96 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activity.iconBg}`}
            >
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;