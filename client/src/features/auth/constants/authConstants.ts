import type { City } from "../types/auth.types";

// ─── API Endpoints ────────────────────────────────────────────────────────────

export const AUTH_ENDPOINTS = {
  REGISTER:         "/auth/register",
  REGISTER_BUYER:   "/auth/register/buyer",
  REGISTER_SELLER:  "/auth/register/seller",
  LOGIN:            "/auth/login",
  LOGOUT:           "/auth/logout",
  VERIFY_OTP:       "/auth/verify-otp",
  VERIFY_RESET_OTP: "/auth/verify-reset-otp",
  RESEND_OTP:       "/auth/resend-otp",
  FORGOT_PASSWORD:  "/auth/forgot-password",
  RESET_PASSWORD:   "/auth/reset-password",
  GOOGLE_OAUTH:     "/auth/google",
  PROFILE:          "/auth/profile",
} as const;

// ─── User Roles ───────────────────────────────────────────────────────────────

export const USER_ROLES = {
  BUYER:  "BUYER",
  SELLER: "SELLER",
} as const;

// ─── Pakistan Cities ──────────────────────────────────────────────────────────

export const PAKISTAN_CITIES: City[] = [
  { value: "karachi",    label: "Karachi"    },
  { value: "lahore",     label: "Lahore"     },
  { value: "islamabad",  label: "Islamabad"  },
  { value: "rawalpindi", label: "Rawalpindi" },
  { value: "faisalabad", label: "Faisalabad" },
  { value: "multan",     label: "Multan"     },
  { value: "peshawar",   label: "Peshawar"   },
  { value: "quetta",     label: "Quetta"     },
  { value: "sialkot",    label: "Sialkot"    },
  { value: "gujranwala", label: "Gujranwala" },
  { value: "hyderabad",  label: "Hyderabad"  },
  { value: "bahawalpur", label: "Bahawalpur" },
  { value: "other",      label: "Other"      },
];

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  TOKEN: "zameen360_token",
  USER:  "zameen360_user",
} as const;

// ─── Hero Features ────────────────────────────────────────────────────────────

export const HERO_FEATURES = [
  {
    icon:  "fa-building",
    title: "Wide Range of Properties",
    desc:  "Houses, plots, apartments & more",
  },
  {
    icon:  "fa-shield-halved",
    title: "Trusted & Verified Listings",
    desc:  "Every listing is authenticated",
  },
  {
    icon:  "fa-handshake",
    title: "Connect with Buyers & Sellers",
    desc:  "Direct communication, zero hassle",
  },
] as const;

// ─── Footer Advantages ────────────────────────────────────────────────────────

export const FOOTER_ADVANTAGES = [
  {
    icon:  "fa-building",
    title: "Wide Range of Properties",
    desc:  "Houses, plots & apartments",
  },
  {
    icon:  "fa-shield-halved",
    title: "Trusted & Verified",
    desc:  "Authenticated listings only",
  },
  {
    icon:  "fa-magnifying-glass-location",
    title: "Smart Search",
    desc:  "Find properties instantly",
  },
  {
    icon:  "fa-headset",
    title: "24/7 Support",
    desc:  "Always here to help you",
  },
] as const;