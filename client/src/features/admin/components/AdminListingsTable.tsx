// components/AdminListingsTable.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { getAdminProperties, updatePropertyStatus, deletePropertyAdmin } from '../services/adminApi';
import type { AdminProperty } from '../services/adminApi';

interface Props {
  status: 'all' | 'pending' | 'approved' | 'rejected';
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-100 text-red-600 border border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  pending:  'bg-amber-400',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
};

const formatPrice = (p: string | number | null) => {
  if (!p) return 'N/A';
  return 'PKR ' + new Intl.NumberFormat('en-IN').format(Number(p));
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const AdminListingsTable: React.FC<Props> = ({ status }) => {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading]       = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminProperties(status, search, page);
      setProperties(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast('Failed to fetch properties', 'error');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatus = async (id: number, newStatus: 'approved' | 'rejected' | 'pending') => {
    setActionLoading(id);
    try {
      await updatePropertyStatus(id, newStatus);
      showToast(`Property ${newStatus} successfully!`);
      fetchData();
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await deletePropertyAdmin(id);
      showToast('Property deleted successfully!');
      setConfirmDelete(null);
      fetchData();
    } catch {
      showToast('Failed to delete property', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Delete Property</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={actionLoading === confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {actionLoading === confirmDelete ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, city..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">
          {loading ? 'Loading…' : `${total} listing${total !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading listings…</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-sm text-gray-400">
              {search ? 'Try a different search term.' : 'No properties in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Property</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Location</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Price</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Submitted</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                          {prop.images && prop.images.length > 0 ? (
                            <img
                              src={prop.images[0]}
                              alt={prop.title || 'Property'}
                              className="w-full h-full object-cover"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=80&h=80&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 max-w-[180px] truncate">
                            {prop.title || 'Untitled Property'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">ID #{prop.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700">{prop.city || '—'}</p>
                      <p className="text-xs text-gray-400">{prop.locality || ''}</p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{prop.propertyType || '—'}</span>
                      {prop.purpose && (
                        <p className="text-xs text-gray-400 mt-0.5">For {prop.purpose}</p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(prop.price)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[prop.status] || 'bg-gray-100 text-gray-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[prop.status] || 'bg-gray-400'}`} />
                        {prop.status.charAt(0).toUpperCase() + prop.status.slice(1)}
                      </span>
                    </td>

                    {/* Submitted */}
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(prop.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {prop.status !== 'approved' && (
                          <button
                            onClick={() => handleStatus(prop.id, 'approved')}
                            disabled={actionLoading === prop.id}
                            title="Approve"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === prop.id ? (
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            Approve
                          </button>
                        )}

                        {prop.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatus(prop.id, 'rejected')}
                            disabled={actionLoading === prop.id}
                            title="Reject"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === prop.id ? (
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            Reject
                          </button>
                        )}

                        {prop.status === 'rejected' && (
                          <button
                            onClick={() => handleStatus(prop.id, 'pending')}
                            disabled={actionLoading === prop.id}
                            title="Move back to Pending"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Re-review
                          </button>
                        )}

                        <button
                          onClick={() => setConfirmDelete(prop.id)}
                          disabled={actionLoading === prop.id}
                          title="Delete"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingsTable;
