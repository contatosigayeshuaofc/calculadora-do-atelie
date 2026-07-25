export function onlyPhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatBrazilianWhatsapp(value: string) {
  const digits = onlyPhoneDigits(value);

  if (!digits) {
    return "";
  }

  const areaCode = digits.slice(0, 2);
  const firstPart = digits.slice(2, 7);
  const secondPart = digits.slice(7, 11);

  if (digits.length <= 2) {
    return `(${areaCode}`;
  }

  if (digits.length <= 7) {
    return `(${areaCode}) ${firstPart}`;
  }

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export function normalizeBrazilianWhatsapp(value: string | null) {
  if (!value) {
    return null;
  }

  const formatted = formatBrazilianWhatsapp(value);
  return formatted || null;
}
