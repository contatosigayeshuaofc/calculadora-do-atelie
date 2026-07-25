import { describe, expect, test } from "vitest";
import { parseSaleFormData, parseSaleUpdateData } from "./schemas";

const baseSaleInput = {
  customerId: "",
  deliveryDate: "",
  discount: "",
  items: [
    {
      productId: "11111111-1111-4111-8111-111111111111",
      quantity: "2",
      unitPrice: "R$ 25,00",
    },
  ],
  notes: "",
  orderDate: "2026-07-25",
  paymentMethod: "Pix",
  paymentStatus: "paid",
  saleId: "",
  status: "confirmed",
  deliveryFee: "",
};

describe("sales schemas", () => {
  test("accepts the grouped payment method options", () => {
    expect(parseSaleFormData(baseSaleInput)).toMatchObject({
      paymentMethod: "Pix",
      paymentStatus: "paid",
    });

    expect(
      parseSaleUpdateData({
        deliveryDate: "",
        notes: "",
        orderDate: "2026-07-25",
        paymentMethod: "Boleto",
        paymentStatus: "unpaid",
        saleId: "22222222-2222-4222-8222-222222222222",
        status: "awaiting_payment",
      }),
    ).toMatchObject({
      paymentMethod: "Boleto",
      paymentStatus: "unpaid",
    });
  });

  test("rejects typed payment methods outside the menu", () => {
    expect(() =>
      parseSaleFormData({
        ...baseSaleInput,
        paymentMethod: "fiado",
      }),
    ).toThrow("Selecione uma forma de pagamento válida.");
  });
});
