import React from 'react';

interface Listing {
  id: string;
  title: string;
  area: string;
  views: number;
  viewsChange: string;
  inquiries: number;
  inquiriesChange: string;
  saved: number;
  savedChange: string;
  status: 'Active' | 'Inactive';
}

interface Props {
  listings: Listing[];
}

const TopPerformingListings: React.FC<Props> = ({ listings }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-[14px] font-bold text-gray-900 mb-3">Top Performing Listings</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-[11px] font-semibold text-gray-500 pb-2">Property</th>
            <th className="text-left text-[11px] font-semibold text-gray-500 pb-2">Views</th>
            <th className="text-left text-[11px] font-semibold text-gray-500 pb-2">Inquiries</th>
            <th className="text-left text-[11px] font-semibold text-gray-500 pb-2">Saved</th>
            <th className="text-left text-[11px] font-semibold text-gray-500 pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <td className="py-3 pr-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-14 h-10 rounded-md bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-gray-800 leading-tight">{l.title}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{l.area}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">ID: {l.id}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="text-[13px] font-semibold text-gray-800">{l.views}</p>
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 10H4z"/></svg>
                  {l.viewsChange}
                </p>
              </td>
              <td>
                <p className="text-[13px] font-semibold text-gray-800">{l.inquiries}</p>
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 10H4z"/></svg>
                  {l.inquiriesChange}
                </p>
              </td>
              <td>
                <p className="text-[13px] font-semibold text-gray-800">{l.saved}</p>
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 10H4z"/></svg>
                  {l.savedChange}
                </p>
              </td>
              <td>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  l.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {l.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPerformingListings;