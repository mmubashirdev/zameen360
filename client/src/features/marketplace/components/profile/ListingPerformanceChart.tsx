import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

const ListingPerformanceChart: React.FC<Props> = ({ data }) => {
  const [range, setRange] = useState('Last 30 Days');
  const W = 460;
  const H = 200;
  const PAD = { t: 15, r: 15, b: 28, l: 35 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = 2000;
  const points = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * innerW,
    y: PAD.t + innerH - (d.value / max) * innerH,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD.t + innerH} L${points[0].x},${PAD.t + innerH} Z`;
  const yLabels = [0, 500, 1000, 1500, 2000];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900">Listing Performance</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Views over time</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-[11px] bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yLabels.map((label, i) => {
          const y = PAD.t + innerH - (label / max) * innerH;
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#F3F4F6" strokeWidth="1" />
              <text x={PAD.l - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9CA3AF">
                {label >= 1000 ? `${label / 1000}K` : label}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#lpGrad)" />
        <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
        ))}
        {data.map((d, i) => {
          const x = PAD.l + (i / (data.length - 1)) * innerW;
          return (
            <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize="9" fill="#9CA3AF">
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default ListingPerformanceChart;