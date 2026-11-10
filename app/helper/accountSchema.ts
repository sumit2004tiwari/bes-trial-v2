import { z } from "zod";
import { isPureString } from "./helper";

export const accountSchema = z.object({
  name: z
    .string()
    .min(1, { message: "This field is required" })
    .refine(isPureString, { message: "Only alphabets are allowed" }),
  mobile: z
    .string()
    .transform((val) => (isNaN(Number(val)) ? 0 : val.length))
    .pipe(z.number().min(10, "This is not valid")),
  organisation: z.string().min(3, { message: "This field is required" }),
  designation: z.string().min(3, { message: "This field is required" }),
  city: z.string().min(3, { message: "This field is required" }),
  country: z.string().min(1, { message: "This field is required" }),
});

export const emailSchema = z.string().email('Invalid email address');