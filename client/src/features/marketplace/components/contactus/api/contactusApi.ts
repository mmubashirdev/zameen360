import axiosInstance from '@shared/lib/axios';
import type { ContactFormData } from '../contactSchema';

export interface ContactUsResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
  };
}


export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactUsResponse> => {
  try {
    const response = await axiosInstance.post<ContactUsResponse>(
      '/contactus/submit',
      formData
    );
    return response.data;
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
};
