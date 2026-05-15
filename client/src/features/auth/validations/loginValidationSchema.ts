import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((value) => value.trim().toLowerCase()),

  password: z.string().min(1, "Password is required"),

  rememberMe: z.boolean(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;