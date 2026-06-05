import axios from "../../../shared/lib/axios";

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (data: ContactData) => {
  try {
    const response = await axios.post("/contact/send-message", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Failed to send message" };
  }
};
