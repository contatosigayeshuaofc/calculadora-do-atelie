import { getCountryOption } from "@/lib/localization/countries";

export function onlyPhoneDigits(value: string, maxDigits = 15) {
  return value.replace(/\D/g, "").slice(0, maxDigits);
}

function stripCallingCode(digits: string, callingCode: string, localDigits: number) {
  if (digits.length > localDigits && digits.startsWith(callingCode)) {
    return digits.slice(callingCode.length).slice(0, localDigits);
  }

  return digits.slice(0, localDigits);
}

function groupDigits(value: string, groups: number[]) {
  const parts: string[] = [];
  let cursor = 0;

  for (const size of groups) {
    const part = value.slice(cursor, cursor + size);
    if (!part) {
      break;
    }
    parts.push(part);
    cursor += size;
  }

  const remaining = value.slice(cursor);
  if (remaining) {
    parts.push(remaining);
  }

  return parts.join(" ");
}

export function formatWhatsappForCountry(value: string, countryCode?: string) {
  const country = getCountryOption(countryCode);
  const localDigits = stripCallingCode(onlyPhoneDigits(value), country.callingCode, country.localDigits);

  if (!localDigits) {
    return "";
  }

  if (country.code === "BR") {
    const areaCode = localDigits.slice(0, 2);
    const firstPart = localDigits.slice(2, 7);
    const secondPart = localDigits.slice(7, 11);

    if (localDigits.length <= 2) {
      return `+${country.callingCode} (${areaCode}`;
    }

    if (localDigits.length <= 7) {
      return `+${country.callingCode} (${areaCode}) ${firstPart}`;
    }

    return `+${country.callingCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  if (country.code === "US" || country.code === "CA") {
    const areaCode = localDigits.slice(0, 3);
    const firstPart = localDigits.slice(3, 6);
    const secondPart = localDigits.slice(6, 10);

    if (localDigits.length <= 3) {
      return `+${country.callingCode} (${areaCode}`;
    }

    if (localDigits.length <= 6) {
      return `+${country.callingCode} (${areaCode}) ${firstPart}`;
    }

    return `+${country.callingCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  const groups = country.localDigits === 9 ? [3, 3, 3] : [2, 4, 4];
  return `+${country.callingCode} ${groupDigits(localDigits, groups)}`;
}

export function normalizeWhatsappForCountry(value: string | null, countryCode?: string) {
  if (!value) {
    return null;
  }

  const formatted = formatWhatsappForCountry(value, countryCode);
  return formatted || null;
}
