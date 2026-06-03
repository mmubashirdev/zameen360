import React from 'react';

interface Stat {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface ProfileBannerProps {
  name: string;
  title: string;
  company: string;
  location: string;
  joinDate: string;
  badge: string;
  about: string;
  specializations: string;
  languages: string;
  workingHours: string;
  stats: Stat[];
  verifications: string[];
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
  name,
  title,
  company,
  location,
  joinDate,
  badge,
  about,
  specializations,
  languages,
  workingHours,
  stats,
  verifications,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] relative">
      {/* Decorative right side - building silhouette area */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
        }}
      />
      <div className="absolute right-4 top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-20 bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6">
        {/* Change Cover Button */}
        <button className="absolute top-4 right-4 bg-white/95 hover:bg-white text-gray-700 text-[11.5px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm z-10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          Change Cover
        </button>

        {/* Main Row */}
        <div className="flex gap-5 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-[120px] h-[120px] rounded-full bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-500 overflow-hidden flex items-center justify-center">
                <svg className="w-16 h-16 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            {/* Verified badge - top right */}
            <div className="absolute top-1 right-1 w-7 h-7 bg-green-500 rounded-full border-[3px] border-white flex items-center justify-center shadow">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Camera icon - bottom */}
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </button>
          </div>

          {/* Name & Info */}
          <div className="text-white flex-shrink-0 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[28px] font-bold leading-tight">{name}</h1>
              <span className="bg-yellow-400 text-yellow-900 text-[10.5px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {badge}
              </span>
            </div>
            <p className="text-[13px] opacity-95 mb-2">{title}</p>
            <p className="text-[14px] font-semibold mb-2.5">{company}</p>
            <div className="flex flex-col gap-1 text-[11.5px] opacity-95">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path strokeLinecap="round" d="M16 3v4M8 3v4M3 11h18" />
                </svg>
                Joined {joinDate}
              </span>
            </div>
          </div>

          {/* About Me */}
          <div className="text-white flex-1 min-w-[200px] max-w-[260px]">
            <h3 className="text-[14px] font-bold mb-1.5">About Me</h3>
            <p className="text-[11.5px] leading-snug opacity-95 mb-2.5">{about}</p>
            <div className="space-y-1 text-[11.5px]">
              <p>
                <span className="font-semibold">Specializations:</span>{' '}
                <span className="opacity-95">{specializations}</span>
              </p>
              <p>
                <span className="font-semibold">Languages:</span>{' '}
                <span className="opacity-95">{languages}</span>
              </p>
              <p>
                <span className="font-semibold">Working Hours:</span>{' '}
                <span className="opacity-95">{workingHours}</span>
              </p>
            </div>
          </div>

          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-2.5 flex-shrink-0">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-3 py-2.5 min-w-[125px] shadow-sm flex items-center gap-2.5"
              >
                <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <span className={stat.iconColor}>{stat.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
                  <p className="text-[18px] font-bold text-gray-900 leading-tight">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-[9px] text-gray-400 leading-tight">{stat.subValue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verifications Row */}
        <div className="flex flex-wrap gap-2 mt-5">
          {verifications.map((v, i) => (
            <span
              key={i}
              className="bg-white text-gray-700 text-[11.5px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
            >
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

      {/* Bottom White Section - Action Buttons */}
      <div className="bg-white px-6 py-3.5 flex items-center gap-2">
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[12.5px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[12.5px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Share Profile
        </button>
        <button className="bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 text-[12.5px] font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Public Profile
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileBanner;