// client/src/features/auth/components/AuthLayout.tsx
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Home, Users, MapPin } from "lucide-react";
import logo from "../../../assets/chatgpt_image_may_12__2026__11_24_22_pm_720-removebg-preview.png";

interface AuthLayoutProps {
  children: ReactNode;
}

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      {/* ─── Left Panel (Desktop only) ─────────────────────── */}
      <div className="hidden lg:flex relative w-[45%] h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Real Estate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-back from-black/40 via-black/55 to-black/80" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-12 text-white">
          {/* Brand with Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Zameen 360"
              className="h-50 pb-2.5 w-auto object-contain"
            />
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-5">
              Find. Buy. Sell.
              <br />
              Your Property{" "}
              <span className="text-blue-400 border-b-4 border-blue-400 pb-1">
                360°
              </span>
            </h2>
            <p className="text-base text-white/75 leading-relaxed">
              Discover the best properties, connect with trusted agents, and
              make smart real estate decisions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Stat icon={<Home size={22} />} value="10K+" label="Properties" />
            <Stat icon={<Users size={22} />} value="500+" label="Agents" />
            <Stat icon={<MapPin size={22} />} value="50+" label="Cities" />
          </div>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-break from-gray-50 to-white h-screen overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center mb-4">
          <img
            src={logo}
            alt="Zameen 360"
            className="h-10 w-auto object-contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-blue-300 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
      <div className="text-xs text-white/70 mt-1">{label}</div>
    </div>
  );
}
