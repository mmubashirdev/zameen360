import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/profile/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { getMyListings } from '../../../api/seller.api';

interface Property {
  id: number;
  title: string | null;
  propertyType: string | null;
  purpose: string | null;
  city: string | null;
  locality: string | null;
  price: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  areaSize: string | null;
  areaUnit: string | null;
  status: string;
  images: string[];
  createdAt: string;
}

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    all: 0,
    approved: 0,
    pending: 0,
    sold: 0,
    rejected: 0,
  });

  const fetchListings = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = { page: 1, limit: 50 };
      if (status && status !== 'all') {
        filters.status = status;
      }
      const data = await getMyListings(filters);
      setListings(data.listings || []);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStats = async () => {
    try {
      const allData = await getMyListings({ page: 1, limit: 1000 });
      const all = allData.listings || [];
      setStats({
        all: all.length,
        approved: all.filter((p: Property) => p.status === 'approved').length,
        pending: all.filter((p: Property) => p.status === 'pending').length,
        sold: all.filter((p: Property) => p.status === 'sold').length,
        rejected: all.filter((p: Property) => p.status === 'rejected').length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchListings(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const formatPrice = (price: string | null) => {
    if (!price) return 'Price on request';
    const num = parseInt(price);
    if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2)} Crore`;
    if (num >= 100000) return `PKR ${(num / 100000).toFixed(2)} Lakh`;
    return `PKR ${num.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      sold: 'bg-blue-100 text-blue-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const filters = [
    { id: 'all', label: 'All', count: stats.all },
    { id: 'approved', label: 'Active', count: stats.approved },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'sold', label: 'Sold', count: stats.sold },
    { id: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Sidebar />

      <main className="ml-[224px] mr-[20px] pt-[80px]">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.all} {stats.all === 1 ? 'property' : 'properties'} total
                </p>
              </div>
              <button
                onClick={() => navigate('/post-property')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Property
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-100">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeFilter === filter.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === filter.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeFilter === 'all' ? 'No listings yet' : `No ${activeFilter} listings`}
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first property listing
              </p>
              <button
                onClick={() => navigate('/post-property')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/property?id=${property.id}`)}
                >
                  {/* Image */}
                  <div className="relative w-full h-40 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title || 'Property'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(property.status)}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                    {property.purpose && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        For {property.purpose}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                      {property.title || 'Untitled Property'}
                    </h3>
                    <p className="text-blue-600 font-bold text-lg mb-2">
                      {formatPrice(property.price)}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <circle cx="12" cy="11" r="3" />
                      </svg>
                      <span className="line-clamp-1">
                        {property.locality && `${property.locality}, `}
                        {property.city || 'Pakistan'}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 pt-3 border-t border-gray-100">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          🛏️ {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          {property.bathrooms}
                        </span>
                      )}
                      {property.areaSize && (
                        <span className="flex items-center gap-1">
                           {property.areaSize} {property.areaUnit || ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyListings;