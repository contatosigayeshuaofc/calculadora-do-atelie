export const DEFAULT_CURRENCY_CODE = "BRL";

export const supportedCurrencies = [
  { code: "BRL", locale: "pt-BR", label: "Real brasileiro", symbol: "R$" },
  { code: "USD", locale: "en-US", label: "Dólar americano", symbol: "$" },
  { code: "EUR", locale: "de-DE", label: "Euro", symbol: "€" },
  { code: "GBP", locale: "en-GB", label: "Libra esterlina", symbol: "£" },
  { code: "CAD", locale: "en-CA", label: "Dólar canadense", symbol: "CA$" },
  { code: "AUD", locale: "en-AU", label: "Dólar australiano", symbol: "A$" },
  { code: "MXN", locale: "es-MX", label: "Peso mexicano", symbol: "MX$" },
  { code: "ARS", locale: "es-AR", label: "Peso argentino", symbol: "$" },
  { code: "CLP", locale: "es-CL", label: "Peso chileno", symbol: "$" },
] as const;

export type SupportedCurrencyCode = (typeof supportedCurrencies)[number]["code"];

export function normalizeCurrencyCode(value: string | null | undefined): SupportedCurrencyCode {
  const normalized = value?.trim().toUpperCase();
  const option = supportedCurrencies.find((currency) => currency.code === normalized);

  return option?.code ?? DEFAULT_CURRENCY_CODE;
}

export function getCurrencyOption(value: string | null | undefined) {
  const code = normalizeCurrencyCode(value);

  return supportedCurrencies.find((currency) => currency.code === code) ?? supportedCurrencies[0];
}
