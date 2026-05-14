import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((val) => {
      // Allow email OR phone number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const cleaned = val.replace(/[\s\-()]/g, "");
      const isPhone =
        /^(\+92|0)?[3][0-9]{9}$/.test(cleaned) ||
        /^\+?\d{7,15}$/.test(cleaned);
      return isEmail || isPhone;
    }, "Enter a valid email or phone number"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;