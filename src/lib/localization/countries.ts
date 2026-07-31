import { DEFAULT_CURRENCY_CODE, normalizeCurrencyCode, type SupportedCurrencyCode } from "@/lib/currency/supported-currencies";

export const DEFAULT_COUNTRY_CODE = "BR";

export const supportedCountries = [
  { code: "BR", label: "Brasil", callingCode: "55", currencyCode: "BRL", locale: "pt-BR", localDigits: 11 },
  { code: "PT", label: "Portugal", callingCode: "351", currencyCode: "EUR", locale: "pt-PT", localDigits: 9 },
  { code: "US", label: "Estados Unidos", callingCode: "1", currencyCode: "USD", locale: "en-US", localDigits: 10 },
  { code: "GB", label: "Reino Unido", callingCode: "44", currencyCode: "GBP", locale: "en-GB", localDigits: 10 },
  { code: "CA", label: "Canadá", callingCode: "1", currencyCode: "CAD", locale: "en-CA", localDigits: 10 },
  { code: "AU", label: "Austrália", callingCode: "61", currencyCode: "AUD", locale: "en-AU", localDigits: 9 },
  { code: "MX", label: "México", callingCode: "52", currencyCode: "MXN", locale: "es-MX", localDigits: 10 },
  { code: "AR", label: "Argentina", callingCode: "54", currencyCode: "ARS", locale: "es-AR", localDigits: 10 },
  { code: "CL", label: "Chile", callingCode: "56", currencyCode: "CLP", locale: "es-CL", localDigits: 9 },
] as const;

export type SupportedCountryCode = (typeof supportedCountries)[number]["code"];

export function normalizeCountryCode(value: string | null | undefined): SupportedCountryCode {
  const normalized = value?.trim().toUpperCase();
  const option = supportedCountries.find((country) => country.code === normalized);

  return option?.code ?? DEFAULT_COUNTRY_CODE;
}

export function getCountryOption(value: string | null | undefined) {
  const code = normalizeCountryCode(value);

  return supportedCountries.find((country) => country.code === code) ?? supportedCountries[0];
}

export function getDefaultCurrencyForCountry(value: string | null | undefined): SupportedCurrencyCode {
  const country = getCountryOption(value);

  return normalizeCurrencyCode(country.currencyCode ?? DEFAULT_CURRENCY_CODE);
}
