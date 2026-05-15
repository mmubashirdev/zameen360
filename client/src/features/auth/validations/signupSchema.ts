import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens"
      ),

    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .toLowerCase(),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => {
        const cleaned = val.replace(/[\s\-()]/g, "");
        return (
          /^(\+92|0)?[3][0-9]{9}$/.test(cleaned) ||
          /^\+?\d{7,15}$/.test(cleaned)
        );
      }, "Enter a valid phone (e.g., +92 300 1234567)"),

    city: z.string().min(1, "Please select your city"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Min 8 characters required")
      .regex(/[A-Z]/, "Need at least one uppercase letter")
      .regex(/[a-z]/, "Need at least one lowercase letter")
      .regex(/[0-9]/, "Need at least one number")
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Need at least one special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    role: z.enum(["buyer", "seller"], {
      message: "Please select your role",
    }),

    terms: z.literal(true, {
      message: "You must agree to the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;