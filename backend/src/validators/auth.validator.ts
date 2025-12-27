import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&#]/, "Must contain at least one special character"),

  gender: z.enum(["male", "female", "other"]),
  height: z.number().positive(),
  weight: z.number().positive(),
  birthday: z.coerce.date(),
  goal: z.enum(["lose", "maintain", "gain"]),
});
