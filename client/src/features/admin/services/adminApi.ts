import axios from "axios";

const BASE_URL = "http://localhost:5000/api/properties";

// Property type (jaisa backend se aata hai)
export interface AdminProperty {
  id: number;
  title: string | null;
  purpose: string | null;
  propertyType: string | null;
  price: string | number | null;
  city: string | null;
  locality: string | null;
  address: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  areaSize: string | null;
  areaUnit: string | null;
  description: string | null;
  amenities: string[];
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await axios.get(`${BASE_URL}/admin/stats`);
  return res.data.data;
};

// Get properties (admin)
export const getAdminProperties = async (
  status: string = "all",
  search: string = "",
  page: number = 1
) => {
  let url = `${BASE_URL}/admin/all?page=${page}`;
  if (status !== "all") url += `&status=${status}`;
  if (search) url += `&search=${search}`;

  const res = await axios.get(url);
  return res.data;
};

// Approve/Reject
export const updatePropertyStatus = async (
  id: number,
  status: "approved" | "rejected" | "pending"
) => {
  const res = await axios.put(`${BASE_URL}/admin/${id}/status`, { status });
  return res.data;
};

// Delete
export const deletePropertyAdmin = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};