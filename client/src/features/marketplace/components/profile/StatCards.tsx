import React from 'react';

interface SparkData {
  points: number[];
  color: string;
}

interface StatCard {
  label: string;
  subLabel?: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  link?: string;
  subValue?: string;
  spark?: SparkData;
}

const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const w = 90;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCards: React.FC = () => {
  const cards: StatCard[] = [
    {
      label: 'Active Listings',
      value: '45',
      change: '+5 this week',
      changeColor: 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z"/></svg>),
      link: 'View all',
    },
    {
      label: 'Total Views',
      subLabel: '(This Month)',
      value: '12,456',
      change: '+23%',
      changeColor: 'text-green-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>),
      spark: { points: [8, 10, 9, 12, 11, 14, 13, 16, 15, 18], color: '#3B82F6' },
    },
    {
      label: 'New Leads',
      subLabel: '(This Week)',
      value: '28',
      change: '+15%',
      changeColor: 'text-green-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>),
      link: 'View leads',
    },
    {
      label: 'Properties',
      subLabel: 'Sold/Rented',
      value: '127',
      change: '+3 this month',
      changeColor: 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6"/></svg>),
      subValue: 'PKR 5,67,000',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-start gap-3 mb-2">
            <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
              <span className={c.iconColor}>{c.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-500 font-medium leading-tight">{c.label}</p>
              {c.subLabel && <p className="text-[10px] text-gray-400 leading-tight">{c.subLabel}</p>}
              <p className="text-[24px] font-bold text-gray-900 leading-tight mt-0.5">{c.value}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-[11px] font-semibold ${c.changeColor} flex items-center gap-0.5`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              {c.change}
            </p>
            {c.spark && <Sparkline points={c.spark.points} color={c.spark.color} />}
          </div>
          {c.subValue && <p className="text-[12px] font-semibold text-gray-700 mt-1">{c.subValue}</p>}
          {c.link && <a href="#" className="text-[11px] text-blue-600 font-medium mt-1 hover:underline inline-block">{c.link}</a>}
        </div>
      ))}
    </div>
  );
};

export default StatCards;