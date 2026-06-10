import API from "./axios";

// Types
export interface SellerProfile {
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
  sellerDetail: {
    totalListings: number;
    activeListings: number;
    soldProperties: number;
    sellerRating: number | null;
    isPremium: boolean;
  } | null;
  profileCompletion: number;
  verifications: {
    identity: boolean;
    phone: boolean;
    email: boolean;
    business: boolean;
  };
  totalProperties: number;
}

export interface UpdateProfileData {
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

// ✅ Get Profile
export const getSellerProfile = async (): Promise<SellerProfile> => {
  const response = await API.get("/seller/profile");
  return response.data.data;
};

// ✅ Update Profile
export const updateSellerProfile = async (
  data: UpdateProfileData
): Promise<SellerProfile> => {
  const response = await API.put("/seller/profile", data);
  return response.data.data;
};

// ✅ Get Stats
export const getSellerStats = async () => {
  const response = await API.get("/seller/stats");
  return response.data.data;
};

// ✅ Get My Listings
export const getMyListings = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await API.get("/seller/listings", { params: filters });
  return response.data.data;
};

// ✅ Get Activity
export const getSellerActivity = async (limit: number = 10) => {
  const response = await API.get("/seller/activity", {
    params: { limit },
  });
  return response.data.data;
};