export function parseCurrencyInput(value: string): number {
  const normalized = value.trim();

  if (!normalized) {
    return 0;
  }

  const isNegative = normalized.includes("-");
  const digitsAndSeparators = normalized.replace(/[^\d,.]/g, "");

  if (!digitsAndSeparators) {
    return 0;
  }

  const decimalSeparator = findDecimalSeparator(digitsAndSeparators);
  const cents = decimalSeparator
    ? parseWithDecimalSeparator(digitsAndSeparators, decimalSeparator)
    : Number(digitsAndSeparators.replace(/\D/g, "")) * 100;

  return isNegative ? -cents : cents;
}

function findDecimalSeparator(value: string): "," | "." | null {
  const lastCommaIndex = value.lastIndexOf(",");
  const lastDotIndex = value.lastIndexOf(".");

  if (lastCommaIndex >= 0) {
    return ",";
  }

  if (lastDotIndex < 0) {
    return null;
  }

  const digitsAfterDot = value.slice(lastDotIndex + 1).replace(/\D/g, "").length;

  return digitsAfterDot === 3 ? null : ".";
}

function parseWithDecimalSeparator(value: string, separator: "," | "."): number {
  const separatorIndex = value.lastIndexOf(separator);
  const integerPart = value.slice(0, separatorIndex).replace(/\D/g, "");
  const decimalPart = value.slice(separatorIndex + 1).replace(/\D/g, "");
  const paddedDecimalPart = decimalPart.padEnd(2, "0").slice(0, 2);
  const reais = Number(integerPart || "0");
  const centavos = Number(paddedDecimalPart || "0");

  return reais * 100 + centavos;
}
