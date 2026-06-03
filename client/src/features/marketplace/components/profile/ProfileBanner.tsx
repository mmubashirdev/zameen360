import React, { useRef } from 'react';
import { useUser } from './UserContext';

const ProfileBanner: React.FC = () => {
  const { user, setProfileImage } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile image upload handler
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type check
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

  return (
    <div className="bg-blue-600 rounded-2xl overflow-hidden relative">
      {/* Change Cover Button */}
      <button className="absolute top-4 right-4 bg-white text-gray-700 text-[12px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm z-10 hover:bg-gray-50">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        Change Cover
      </button>

      <div className="p-6">
        <div className="flex gap-6 items-start">
          {/* AVATAR - CLICK HERE TO UPLOAD */}
          <div className="relative flex-shrink-0">
            <div
              onClick={handleImageClick}
              className="w-[130px] h-[130px] rounded-full bg-gray-300 cursor-pointer overflow-hidden border-4 border-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* Green Verified Badge */}
            <div className="absolute top-1 right-1 w-7 h-7 bg-green-500 rounded-full border-[3px] border-white flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Camera icon to upload */}
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

            {/* Hidden file input */}
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
              <h1 className="text-[26px] font-bold">{user.name}</h1>
              <span className="bg-yellow-400 text-yellow-900 text-[10.5px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Top Seller
              </span>
            </div>
            <p className="text-[13px] mb-3">Verified Real Estate Seller</p>
            <p className="text-[14px] font-semibold mb-3">Malik Properties</p>
            <div className="space-y-1 text-[12px]">
              <p className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                Lahore, Pakistan
              </p>
              <p className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path strokeLinecap="round" d="M16 3v4M8 3v4M3 11h18" />
                </svg>
                Joined March 2023
              </p>
            </div>
          </div>

          {/* About Me */}
          <div className="text-white flex-1 max-w-[280px]">
            <h3 className="text-[14px] font-bold mb-2">About Me</h3>
            <p className="text-[12px] leading-relaxed mb-3">
              Experienced real estate professional specializing in residential and commercial properties. Helping clients find their perfect property with trust and transparency.
            </p>
            <div className="space-y-1 text-[12px]">
              <p><span className="font-semibold">Specializations:</span> Residential | Commercial</p>
              <p><span className="font-semibold">Languages:</span> Urdu, English, Punjabi</p>
              <p><span className="font-semibold">Working Hours:</span> 9 AM - 8 PM</p>
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
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex gap-2 mt-5">
          {['Identity Verified', 'Phone Verified', 'Email Verified', 'Business Verified'].map((v) => (
            <span key={v} className="bg-white text-gray-700 text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* White Bottom - Action Buttons */}
      <div className="bg-white px-6 py-4 flex items-center gap-2">
        <button className="border border-gray-200 text-gray-700 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-gray-50">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
        <button className="border border-gray-200 text-gray-700 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-gray-50">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Share Profile
        </button>
        <button className="border border-blue-200 text-blue-600 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-blue-50">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Public Profile
        </button>
        <button className="border border-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileBanner;