// schema.ts
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  company: z.string().min(1, "Company Name is required"),
  designation: z.string().optional(),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  about_expo: z.string().min(1, "This field is required"),
});
