import { formatCurrency } from "@/lib/currency/format-currency";

export function formatCurrencyFromDigits(value: string, currencyCode?: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return formatCurrency(Number(digits), currencyCode);
}

export function sanitizeDecimalInput(value: string): string {
  const normalized = value.replace(/\./g, ",").replace(/[^\d,]/g, "");
  const [integerPart = "", ...decimalParts] = normalized.split(",");
  const decimalPart = decimalParts.join("");

  return decimalParts.length > 0
    ? `${integerPart},${decimalPart}`
    : integerPart;
}

export function sanitizeIntegerInput(value: string): string {
  return value.replace(/\D/g, "");
}
