import { describe, expect, it } from "vitest";
import { parseSettingsFormData } from "./schemas";

describe("parseSettingsFormData", () => {
  it("normalizes profile fields, country, currency and multiplier numbers", () => {
    const result = parseSettingsFormData({
      atelierName: "  Atelie Flor de Cera  ",
      countryCode: "PT",
      currencyCode: "EUR",
      fullName: "  Marina Lopes  ",
      minimumMultiplier: "1,7",
      recommendedMultiplier: "2,4",
      whatsapp: "912345678",
    });

    expect(result).toEqual({
      atelierName: "Atelie Flor de Cera",
      countryCode: "PT",
      currencyCode: "EUR",
      fullName: "Marina Lopes",
      minimumMultiplier: 1.7,
      recommendedMultiplier: 2.4,
      whatsapp: "+351 912 345 678",
    });
  });

  it("stores empty optional fields as null", () => {
    const result = parseSettingsFormData({
      atelierName: "",
      countryCode: "",
      currencyCode: "",
      fullName: "Marina Lopes",
      minimumMultiplier: "1.5",
      recommendedMultiplier: "2",
      whatsapp: " ",
    });

    expect(result.atelierName).toBeNull();
    expect(result.countryCode).toBe("BR");
    expect(result.currencyCode).toBe("BRL");
    expect(result.whatsapp).toBeNull();
  });

  it("rejects recommended multiplier below minimum multiplier", () => {
    expect(() =>
      parseSettingsFormData({
        atelierName: "Atelie",
        countryCode: "BR",
        currencyCode: "BRL",
        fullName: "Marina Lopes",
        minimumMultiplier: "2,5",
        recommendedMultiplier: "2",
        whatsapp: "",
      }),
    ).toThrow("O multiplicador recomendado precisa ser igual ou maior que o mínimo.");
  });
});
