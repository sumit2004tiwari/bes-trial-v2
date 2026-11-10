import z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const onlyDigits = (val: string) => /^\d+$/.test(val);

export const memberProfileSchema = z.object({
  membership_category: z.string().min(1, "Membership category is required"),
  membership_no: z
    .string()
    .min(1, "Membership number is required")
    .refine((val) => onlyDigits(val), "Membership number must be numeric"),
  mobile_no: z
    .string()
    .refine(
      (val) =>
        val.startsWith("+")
          ? isValidPhoneNumber(val)
          : /^\d{10,}$/.test(val),
      "Please provide a valid mobile number"
    ),
  designation: z.string().optional(),
  organization_address: z
    .string()
    .min(1, "Organization address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  pin_code: z
    .string()
    .min(1, "Pin code is required")
    .refine((val) => onlyDigits(val), "Pin code must contain only digits"),
  state: z.string().min(1, "State is required"),
});

export type MemberProfileInput = z.infer<typeof memberProfileSchema>;