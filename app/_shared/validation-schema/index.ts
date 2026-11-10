import z from "zod";
import { emailValidator } from "../utility/validator";

export const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is not valid")
    .refine((val) => emailValidator(val), {
      message: "Email is not valid.",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
