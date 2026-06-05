import React from 'react';

interface Task {
  text: string;
  variant: 'blue' | 'yellow' | 'red';
}

interface Props {
  tasks: Task[];
}

const UpcomingTasks: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-[14px] font-bold text-gray-900 mb-3">Upcoming Tasks</h3>
      <div className="space-y-2.5">
        {tasks.map((t, i) => {
          const colors: Record<string, string> = {
            blue: 'text-blue-500',
            yellow: 'text-yellow-500',
            red: 'text-red-500',
          };
          return (
            <div key={i} className="flex items-center gap-2.5">
              <svg className={`w-4 h-4 ${colors[t.variant]} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path strokeLinecap="round" d="M8 3v4M16 3v4M3 11h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l1.5 1.5L14 13" />
              </svg>
              <p className="text-[12px] text-gray-700">{t.text}</p>
            </div>
          );
        })}
      </div>
      <a href="#" className="text-[11.5px] text-blue-600 font-medium mt-4 inline-block hover:underline">View all tasks</a>
    </div>
  );
};

export default UpcomingTasks;