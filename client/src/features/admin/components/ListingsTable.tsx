// components/ListingsTable.tsx
import React from 'react';

interface Listing {
  image: string;
  property: string;
  area: string;
  location: string;
  type: string;
  price: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedOn: string;
}

const StatusBadge: React.FC<{ status: 'Pending' | 'Approved' | 'Rejected' }> = ({ status }) => {
  const styles = {
    Pending: 'bg-orange-100 text-orange-600',
    Approved: 'bg-green-100 text-green-600',
    Rejected: 'bg-red-100 text-red-600',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const ListingsTable: React.FC = () => {
  const listings: Listing[] = [
    {
      image: '🏠',
      property: '5 Marla House',
      area: 'DHA Phase 6',
      location: 'Lahore',
      type: 'House',
      price: 'PKR 2,50,00,000',
      status: 'Pending',
      submittedOn: 'May 16, 2024',
    },
    {
      image: '🏡',
      property: '1 Kanal House',
      area: 'Bahria Town',
      location: 'Karachi',
      type: 'House',
      price: 'PKR 4,80,00,000',
      status: 'Approved',
      submittedOn: 'May 16, 2024',
    },
    {
      image: '🏢',
      property: '2 Bed Apartment',
      area: 'Clifton',
      location: 'Karachi',
      type: 'Apartment',
      price: 'PKR 1,25,00,000',
      status: 'Pending',
      submittedOn: 'May 15, 2024',
    },
    {
      image: '🏗️',
      property: '10 Marla Plot',
      area: 'Lahore Smart City',
      location: 'Lahore',
      type: 'Plot',
      price: 'PKR 1,90,00,000',
      status: 'Rejected',
      submittedOn: 'May 15, 2024',
    },
    {
      image: '🏠',
      property: '3 Marla House',
      area: 'Al Rehman Garden',
      location: 'Lahore',
      type: 'House',
      price: 'PKR 1,10,00,000',
      status: 'Approved',
      submittedOn: 'May 14, 2024',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Recent Listings</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          View All Listings
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Property</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Location</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Type</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Price</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Status</th>
              <th className="text-left text-xs font-semibold text-gray-400 pb-3">Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-b-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${
                          index === 0
                            ? '1564013799919-ab600027ffc6'
                            : index === 1
                            ? '1600596542815-ffad4c1539a9'
                            : index === 2
                            ? '1522708323590-d24dbb6b0267'
                            : index === 3
                            ? '1500382017468-9049fed747ef'
                            : '1600585154340-be6161a56a0c'
                        }?w=80&h=80&fit=crop`}
                        alt={listing.property}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.textContent = listing.image;
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{listing.property}</p>
                      <p className="text-xs text-gray-400">{listing.area}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-600">{listing.location}</td>
                <td className="py-3 pr-4 text-sm text-gray-600">{listing.type}</td>
                <td className="py-3 pr-4 text-sm text-gray-600 whitespace-nowrap">{listing.price}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={listing.status} />
                </td>
                <td className="py-3 text-sm text-gray-600 whitespace-nowrap">{listing.submittedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingsTable;