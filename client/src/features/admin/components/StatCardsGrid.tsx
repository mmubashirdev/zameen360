// components/StatCardsGrid.tsx
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import StatCard from './StatCard';
import { getDashboardStats } from '../services/adminApi';
import type { DashboardStats } from '../services/adminApi';

const StatCardsGrid: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {/* silently ignore; defaults stay 0 */})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total Listings',
      value: loading ? '…' : String(stats.total),
      to: '/admin/all-listings',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      title: 'Pending Approval',
      value: loading ? '…' : String(stats.pending),
      to: '/admin/pending',
      iconBg: 'bg-amber-100',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: 'Approved Listings',
      value: loading ? '…' : String(stats.approved),
      to: '/admin/approved',
      iconBg: 'bg-emerald-100',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: 'Rejected Listings',
      value: loading ? '…' : String(stats.rejected),
      to: '/admin/rejected',
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card) => (
        <NavLink key={card.to} to={card.to} className="block group">
          <div className="relative transition-transform group-hover:-translate-y-0.5">
            <StatCard
              title={card.title}
              value={card.value}
              iconBg={card.iconBg}
              icon={card.icon}
            />
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default StatCardsGrid;