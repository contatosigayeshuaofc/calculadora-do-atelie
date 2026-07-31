export { onlyPhoneDigits } from "./international-phone-input";

import { formatWhatsappForCountry, normalizeWhatsappForCountry } from "./international-phone-input";

export function formatBrazilianWhatsapp(value: string) {
  return formatWhatsappForCountry(value, "BR").replace(/^\+55\s?/, "");
}

export function normalizeBrazilianWhatsapp(value: string | null) {
  return normalizeWhatsappForCountry(value, "BR")?.replace(/^\+55\s?/, "") ?? null;
}
