import axiosInstance from "../../utils/axiosInstance";

export const forgotPasswordService = async (email: string) => {
  const response = await axiosInstance.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyResetOTPService = async (data: {
  email: string;
  otp: string;
}) => {
  const response = await axiosInstance.post("/auth/verify-reset-otp", data);
  return response.data;
};

export const resetPasswordService = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};
