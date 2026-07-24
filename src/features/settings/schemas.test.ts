import { describe, expect, it } from "vitest";
import { parseSettingsFormData } from "./schemas";

describe("parseSettingsFormData", () => {
  it("normalizes profile fields and multiplier numbers", () => {
    const result = parseSettingsFormData({
      atelierName: "  Atelie Flor de Cera  ",
      fullName: "  Marina Lopes  ",
      minimumMultiplier: "1,7",
      recommendedMultiplier: "2,4",
      whatsapp: "  (11) 99999-0000  ",
    });

    expect(result).toEqual({
      atelierName: "Atelie Flor de Cera",
      fullName: "Marina Lopes",
      minimumMultiplier: 1.7,
      recommendedMultiplier: 2.4,
      whatsapp: "(11) 99999-0000",
    });
  });

  it("stores empty optional fields as null", () => {
    const result = parseSettingsFormData({
      atelierName: "",
      fullName: "Marina Lopes",
      minimumMultiplier: "1.5",
      recommendedMultiplier: "2",
      whatsapp: " ",
    });

    expect(result.atelierName).toBeNull();
    expect(result.whatsapp).toBeNull();
  });

  it("rejects recommended multiplier below minimum multiplier", () => {
    expect(() =>
      parseSettingsFormData({
        atelierName: "Atelie",
        fullName: "Marina Lopes",
        minimumMultiplier: "2,5",
        recommendedMultiplier: "2",
        whatsapp: "",
      }),
    ).toThrow("O multiplicador recomendado precisa ser igual ou maior que o minimo.");
  });
});
