import { describe, expect, it } from "vitest";
import {
  formatCurrencyFromDigits,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
} from "./numeric-input";

describe("numeric input helpers", () => {
  it("formats money from cents while the user types", () => {
    expect(normalizeSpace(formatCurrencyFromDigits("1"))).toBe("R$ 0,01");
    expect(normalizeSpace(formatCurrencyFromDigits("12"))).toBe("R$ 0,12");
    expect(normalizeSpace(formatCurrencyFromDigits("123"))).toBe("R$ 1,23");
    expect(normalizeSpace(formatCurrencyFromDigits("R$ 1,23"))).toBe("R$ 1,23");
  });

  it("removes text from decimal fields", () => {
    expect(sanitizeDecimalInput("10abc,5kg")).toBe("10,5");
    expect(sanitizeDecimalInput("1.25")).toBe("1,25");
  });

  it("keeps only digits in integer fields", () => {
    expect(sanitizeIntegerInput("12 unidades")).toBe("12");
  });
});

function normalizeSpace(value: string) {
  return value.replace(/\s/g, " ");
}
