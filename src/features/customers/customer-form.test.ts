import { describe, expect, test } from "vitest";
import {
  buildEmptyCustomerSummary,
  parseCustomerFormData,
} from "./schemas";

describe("parseCustomerFormData", () => {
  test("normalizes optional customer fields to null", () => {
    expect(
      parseCustomerFormData({
        customerId: "",
        name: "  Maria Clara  ",
        whatsapp: " (11) 99999-9999 ",
        instagram: " @mariaatelie ",
        city: "",
        birthday: "",
        notes: " Cliente prefere retirada. ",
      }),
    ).toEqual({
      customerId: undefined,
      name: "Maria Clara",
      whatsapp: "(11) 99999-9999",
      instagram: "@mariaatelie",
      city: null,
      birthday: null,
      notes: "Cliente prefere retirada.",
    });
  });

  test("requires customer name", () => {
    expect(() =>
      parseCustomerFormData({
        name: " ",
      }),
    ).toThrow("Informe o nome da cliente.");
  });
});

describe("buildEmptyCustomerSummary", () => {
  test("returns zero totals for a customer without sales", () => {
    expect(buildEmptyCustomerSummary()).toEqual({
      orderCount: 0,
      totalSpentCents: 0,
      lastOrderDate: null,
    });
  });
});
