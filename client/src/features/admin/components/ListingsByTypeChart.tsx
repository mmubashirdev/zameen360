// components/ListingsByTypeChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TypeData {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

const ListingsByTypeChart: React.FC = () => {
  const data: TypeData[] = [
    { name: 'Houses', value: 562, color: '#3B82F6', percentage: '45%' },
    { name: 'Apartments', value: 312, color: '#93C5FD', percentage: '25%' },
    { name: 'Plots', value: 250, color: '#22C55E', percentage: '20%' },
    { name: 'Commercial', value: 124, color: '#F59E0B', percentage: '10%' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-96 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Listings by Type</h2>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-44 h-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">1,248</span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600 min-w-20">{item.name}</span>
              <span className="text-sm font-semibold text-gray-800">{item.percentage}</span>
              <span className="text-xs text-gray-400">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingsByTypeChart;