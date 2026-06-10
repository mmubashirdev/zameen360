import React, { useRef, useState } from 'react';
import { useBuyer } from './BuyerContext';
import EditBuyerProfileModal from './EditBuyerProfileModal';  // ⬅️ NEW
import SwitchToSellerModal from './SwitchToSellerModal';

const BuyerProfileBanner: React.FC = () => {
  const { buyer, loading, error, setProfileImage } = useBuyer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setProfileImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-600 rounded-2xl overflow-hidden relative">
        <div className="p-6">
          <div className="flex gap-6 items-start animate-pulse">
            <div className="w-[130px] h-[130px] rounded-full bg-blue-400"></div>
            <div className="flex-1 space-y-3">
              <div className="h-7 bg-blue-400 rounded w-48"></div>
              <div className="h-4 bg-blue-400 rounded w-64"></div>
              <div className="h-4 bg-blue-400 rounded w-40"></div>
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-4 h-16"></div>
      </div>
    );
  }

  // Error state
  if (error || !buyer) {
    return (
      <div className="bg-blue-600 rounded-2xl overflow-hidden relative">
        <div className="p-6 text-center text-white">
          <p className="text-lg font-semibold">
            {error || 'Please login as a buyer to view profile'}
          </p>
        </div>
        <div className="bg-white px-6 py-4 h-16"></div>
      </div>
    );
  }

  const verificationBadges = [
    { label: 'Identity Verified', verified: buyer.verifications?.identity },
    { label: 'Phone Verified', verified: buyer.verifications?.phone },
    { label: 'Email Verified', verified: buyer.verifications?.email },
  ];

  return (
    <>
      <div className="bg-blue-600 rounded-2xl overflow-hidden relative">
        <div className="p-6">
          <div className="flex gap-6 items-start">
            {/* AVATAR */}
            <div className="relative flex-shrink-0">
              <div
                onClick={handleImageClick}
                className="w-[130px] h-[130px] rounded-full bg-gray-300 cursor-pointer overflow-hidden border-4 border-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {buyer.profilePicture ? (
                  <img src={buyer.profilePicture} alt={buyer.fullName} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              {buyer.isVerified && (
                <div className="absolute top-1 right-1 w-7 h-7 bg-green-500 rounded-full border-[3px] border-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <button
                onClick={handleImageClick}
                className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 border border-gray-200"
                title="Upload profile picture"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Name & Info Column */}
            <div className="text-white flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[26px] font-bold">{buyer.fullName}</h1>
                <span className="bg-green-400 text-green-900 text-[10.5px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Buyer
                </span>
              </div>
              <p className="text-[13px] mb-3">
                {buyer.isVerified ? 'Verified Property Buyer' : 'Property Buyer'}
              </p>
              <p className="text-[14px] font-semibold mb-3">
                {buyer.bio || 'Looking for the perfect property'}
              </p>
              <div className="space-y-1 text-[12px]">
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                  {buyer.city ? `${buyer.city}, Pakistan` : 'Pakistan'}
                </p>
                <p className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path strokeLinecap="round" d="M16 3v4M8 3v4M3 11h18" />
                  </svg>
                  Joined {formatJoinedDate(buyer.createdAt)}
                </p>
              </div>
            </div>

            {/* About Me */}
            <div className="text-white flex-1 max-w-[280px]">
              <p className="text-[12px] leading-relaxed mb-3"></p>
              <div className="space-y-1 text-[12px]">
                <p><span className="font-semibold">Email:</span> {buyer.email}</p>
                <div className="h-2"></div>
                <p><span className="font-semibold">Phone:</span> {buyer.phone || 'Not added'}</p>
                <div className="h-2"></div>
                <p><span className="font-semibold">WhatsApp:</span> {buyer.whatsappNumber || 'Not added'}</p>
              </div>
            </div>

            {/* Right Side decorative images */}
            <div className="flex flex-col gap-3 ml-auto">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
                </svg>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="flex gap-2 mt-5">
            {verificationBadges.map((badge) => (
              <span
                key={badge.label}
                className="bg-white text-gray-700 text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    badge.verified ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* White Bottom - Action Buttons */}
        <div className="bg-white px-6 py-4 flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="border border-gray-200 text-gray-700 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-gray-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>

          <button
            onClick={() => setShowSwitchModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-[13px] font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Switch to Seller
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditBuyerProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      {/* Switch to Seller Modal */}
      <SwitchToSellerModal
        open={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
      />
    </>
  );
};

export default BuyerProfileBanner;
