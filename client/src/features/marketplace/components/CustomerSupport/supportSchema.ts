import { z } from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+92|0)[0-9]{10}$/.test(val),
      "Please enter a valid Pakistani phone number"
    ),
  inquiryType: z.string().optional(),
  propertyId: z.string().optional(),
  city: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "whatsapp"], {
    message: "Please select a contact method",
  }),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  interestedIn: z.array(z.string()).optional(),
  agreePolicy: z.literal(true, {
    message: "You must agree to the privacy policy",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;