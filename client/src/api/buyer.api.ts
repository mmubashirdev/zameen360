import API from "./axios";

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
  
  // ⭐ Auto-update token with new SELLER role
  if (response.data.data?.newToken) {
    localStorage.setItem('zameen360_token', response.data.data.newToken);
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