import { describe, expect, test } from "vitest";
import {
  formatBrazilianWhatsapp,
  normalizeBrazilianWhatsapp,
  onlyPhoneDigits,
} from "./phone-input";
import { formatWhatsappForCountry, normalizeWhatsappForCountry } from "./international-phone-input";

describe("phone input helpers", () => {
  test("keeps only phone digits", () => {
    expect(onlyPhoneDigits("(11) abc 99999-8888 texto")).toBe("11999998888");
  });

  test("formats Brazilian WhatsApp from the typed digits", () => {
    expect(formatBrazilianWhatsapp("1")).toBe("(1");
    expect(formatBrazilianWhatsapp("11")).toBe("(11");
    expect(formatBrazilianWhatsapp("1199999")).toBe("(11) 99999");
    expect(formatBrazilianWhatsapp("11999998888")).toBe("(11) 99999-8888");
  });

  test("normalizes empty WhatsApp to null", () => {
    expect(normalizeBrazilianWhatsapp("texto sem numero")).toBeNull();
    expect(normalizeBrazilianWhatsapp(null)).toBeNull();
  });

  test("formats WhatsApp with international country codes", () => {
    expect(formatWhatsappForCountry("912345678", "PT")).toBe("+351 912 345 678");
    expect(formatWhatsappForCountry("5551234567", "US")).toBe("+1 (555) 123-4567");
    expect(normalizeWhatsappForCountry("+351 912 345 678", "PT")).toBe("+351 912 345 678");
  });
});
