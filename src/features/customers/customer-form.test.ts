import { describe, expect, test } from "vitest";
import { buildEmptyCustomerSummary, parseCustomerFormData } from "./schemas";

describe("parseCustomerFormData", () => {
  test("normalizes optional customer fields to null", () => {
    expect(
      parseCustomerFormData({
        birthday: "",
        city: "",
        countryCode: "BR",
        customerId: "",
        instagram: " @mariaatelie ",
        name: "  Maria Clara  ",
        notes: " Cliente prefere retirada. ",
        whatsapp: " (11) texto 99999-9999 ",
      }),
    ).toEqual({
      birthday: null,
      city: null,
      customerId: undefined,
      instagram: "@mariaatelie",
      name: "Maria Clara",
      notes: "Cliente prefere retirada.",
      whatsapp: "+55 (11) 99999-9999",
    });
  });

  test("formats a Portugal customer phone when country is Portugal", () => {
    expect(
      parseCustomerFormData({
        countryCode: "PT",
        name: "Maria",
        whatsapp: "912345678",
      }).whatsapp,
    ).toBe("+351 912 345 678");
  });

  test("requires customer name", () => {
    expect(() =>
      parseCustomerFormData({
        name: " ",
      }),
    ).toThrow("Informe o nome da cliente.");
  });

  test("requires complete WhatsApp when a number is started", () => {
    expect(() =>
      parseCustomerFormData({
        countryCode: "US",
        name: "Maria",
        whatsapp: "999",
      }),
    ).toThrow("Informe um WhatsApp com DDI e número completo.");
  });
});

describe("buildEmptyCustomerSummary", () => {
  test("returns zero totals for a customer without sales", () => {
    expect(buildEmptyCustomerSummary()).toEqual({
      lastOrderDate: null,
      orderCount: 0,
      totalSpentCents: 0,
    });
  });
});
