import axiosInstance from "../../../shared/lib/axios";

export interface SupportData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendSupportMessage = async (data: SupportData) => {
  try {
    const response = await axiosInstance.post("/support/send-message", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
