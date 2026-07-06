import API from "./axios";
import { STORAGE_KEYS } from "../features/auth/constants/authConstants";

// Types
export interface BuyerProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  profilePicture: string | null;
  trustScore: number | null;
  isVerified: boolean;
  role: string;
  createdAt: string;
  bio: string;
  whatsappNumber: string;
  address: string;
  gender: string | null;
  dateOfBirth: string | null;
  profileCompletion: number;
  verifications: {
    identity: boolean;
    phone: boolean;
    email: boolean;
  };
}

export interface UpdateBuyerData {
  fullName?: string;
  phone?: string;
  city?: string;
  profilePicture?: string;
  bio?: string;
  whatsappNumber?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface SwitchToSellerData {
  companyName?: string;
  experience?: string;
  licenseNumber?: string;
  specialization?: string;
  aboutBusiness?: string;
}

// ✅ Get Buyer Profile
export const getBuyerProfile = async (): Promise<BuyerProfile> => {
  const response = await API.get("/buyer/profile");
  return response.data.data;
};

// ✅ Update Buyer Profile
export const updateBuyerProfile = async (
  data: UpdateBuyerData
): Promise<BuyerProfile> => {
  const response = await API.put("/buyer/profile", data);
  return response.data.data;
};

// ✅ Switch to Seller (with additional info)
export const switchToSeller = async (data: SwitchToSellerData) => {
  const response = await API.post("/buyer/switch-to-seller", data);

  const newToken = response.data.data?.newToken;
  if (newToken) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
  }

  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const updatedUser = response.data.data?.user
      ? { ...parsedUser, ...response.data.data.user }
      : parsedUser
        ? { ...parsedUser, role: "SELLER" }
        : null;

    if (updatedUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.warn("Failed to sync seller user data in storage", error);
  }

  return response.data.data;
};

// ✅ Get Buyer Activity
export const getBuyerActivity = async (limit: number = 10) => {
  const response = await API.get("/buyer/activity", {
    params: { limit },
  });
  return response.data.data;
};