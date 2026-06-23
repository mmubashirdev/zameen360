import API from "./axios";

export interface SocietyVerificationData {
  id?: number;
  userId?: number;
  societyName: string;
  societyType: string;
  city: string;
  areaSector: string;
  address: string;
  googleMapsLocation?: string;
  website?: string;
  officialEmail?: string;
  officialContact: string;

  developerCompany: string;
  ownerName: string;
  cnicNumber: string;
  designation: string;
  contactNumber: string;
  emailAddress: string;

  nocStatus: string;
  approvingAuthority: string;
  nocNumber?: string;
  nocIssueDate?: string;
  nocExpiryDate?: string;

  availablePlotSizes: string[];

  status?: string;
  adminNotes?: string;
  createdAt?: string;

  // File URLs (for viewing)
  cnicFront?: string;
  cnicBack?: string;
  companyRegistration?: string;
  ntnCertificate?: string;
  authorityLetter?: string;
  nocCopy?: string;
  ownershipDocuments?: string;
  fardRegistry?: string;
  landTransfer?: string;
}

// User API
export const submitVerification = async (data: FormData) => {
  const response = await API.post("/schemes/applications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getUserVerifications = async () => {
  const response = await API.get("/schemes/applications/me");
  return response.data;
};

export const updateVerification = async (id: number, data: FormData) => {
  const response = await API.put(`/schemes/applications/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Admin API
export const getAllVerifications = async () => {
  const response = await API.get("/schemes/admin/applications");
  return response.data;
};

export const getVerificationById = async (id: number) => {
  const response = await API.get(`/schemes/admin/applications/${id}`);
  return response.data;
};

export const updateVerificationStatus = async (id: number, payload: { status: string; adminNotes?: string }) => {
  const response = await API.patch(`/schemes/admin/applications/${id}/status`, payload);
  return response.data;
};

export const setupSocietyOwnerPassword = async (payload: { token: string; password: string }) => {
  const response = await API.post("/schemes/setup-password", payload);
  return response.data;
};
