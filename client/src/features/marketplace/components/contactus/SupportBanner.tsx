import { Link } from 'react-router-dom';

function SupportBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#2563EB] via-[#0D6EFD] to-[#1D4ED8] p-8 md:p-10 shadow-xl shadow-[#0D6EFD]/20">
      {/* Decorative shapes matching design spec */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/10">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">
              Need Immediate Support Assistance?
            </h3>
            <p className="text-white/80 text-sm mt-1">
               Need extra help? Chat With Our Support Team!
            </p>
          </div>
        </div>

        <Link
          to="/support"
          className="shrink-0 inline-flex items-center gap-2 bg-[#FFFFFF] text-[#2563EB] font-bold px-6 py-3 rounded-lg hover:bg-[#F1F5F9] shadow-lg transition-all duration-200"
        >
          Support Team
        </Link>
      </div>
    </div>
  );
}

export default SupportBanner;
