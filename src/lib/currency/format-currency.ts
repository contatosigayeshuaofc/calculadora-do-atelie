import { getCurrencyOption } from "./supported-currencies";

export function formatCurrency(cents: number, currencyCode?: string): string {
  const roundedCents = Math.round(cents);
  const currency = getCurrencyOption(currencyCode);
  const formatter = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  });

  return formatter.format(roundedCents / 100);
}
