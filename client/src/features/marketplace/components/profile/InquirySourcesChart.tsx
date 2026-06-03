import React from 'react';

interface Source {
  label: string;
  percent: number;
  color: string;
}

interface Props {
  sources: Source[];
  total: number;
}

const InquirySourcesChart: React.FC<Props> = ({ sources, total }) => {
  const R = 55;
  const SW = 22;
  const C = 80;
  const circ = 2 * Math.PI * R;
  let accum = 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="mb-3">
        <h3 className="text-[14px] font-bold text-gray-900">Inquiry Sources</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Where your inquiries come from</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx={C} cy={C} r={R} fill="none" stroke="#F3F4F6" strokeWidth={SW} />
            {sources.map((s, i) => {
              const len = (s.percent / 100) * circ;
              const offset = circ - (accum / 100) * circ;
              accum += s.percent;
              return (
                <circle
                  key={i}
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={SW}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${C} ${C})`}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-bold text-gray-900 leading-none">{total}</span>
            <span className="text-[10px] text-gray-400 mt-1">Total</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {sources.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-gray-600">{s.label}</span>
              </div>
              <span className="font-semibold text-gray-800">{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InquirySourcesChart;