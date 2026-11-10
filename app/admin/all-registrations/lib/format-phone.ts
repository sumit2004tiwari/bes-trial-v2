import { parsePhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

function countryFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function formatPhoneWithCountry(
  mobile: string,
  options?: { defaultCountry?: CountryCode }
): string {
  if (!mobile) return "";
  try {
    const parsed = parsePhoneNumber(mobile, options?.defaultCountry);
    if (parsed?.isValid()) {
      const country = parsed.country || "";
      return `${countryFlagEmoji(country)} ${parsed.formatInternational()}`;
    }
    return mobile;
  } catch {
    return mobile;
  }
}