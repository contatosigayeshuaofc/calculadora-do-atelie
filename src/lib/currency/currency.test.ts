import { describe, expect, test } from "vitest";

import { formatCurrency } from "./format-currency";
import { parseCurrencyInput } from "./parse-currency-input";

describe("currency utilities", () => {
  test("formats integer cents as BRL", () => {
    expect(formatCurrency(0)).toBe("R$\u00a00,00");
    expect(formatCurrency(462)).toContain("4,62");
    expect(formatCurrency(123456)).toContain("1.234,56");
  });

  test("parses BRL text input into integer cents", () => {
    expect(parseCurrencyInput("R$ 1.234,56")).toBe(123456);
    expect(parseCurrencyInput("4,62")).toBe(462);
    expect(parseCurrencyInput("")).toBe(0);
  });

  test("handles common separators and cent-only values", () => {
    expect(parseCurrencyInput("1.234")).toBe(123400);
    expect(parseCurrencyInput("1,2")).toBe(120);
    expect(parseCurrencyInput("0,05")).toBe(5);
    expect(parseCurrencyInput("R$ 12,3")).toBe(1230);
  });

  test("rounds only when formatting fractional cents from calculations", () => {
    expect(formatCurrency(1.5)).toContain("0,02");
    expect(formatCurrency(10.4)).toContain("0,10");
  });
});
