import { describe, expect, test } from "vitest";
import { calculateSaleTotals } from "./calculations";

const baseItem = {
  productId: "produto-1",
  productName: "Vela aromatica",
  saleUnit: "unidade",
  quantity: 1,
  unitPriceCents: 3500,
  unitCostCents: 1200,
  minimumPriceCents: 2200,
  recommendedPriceCents: 3500,
};

describe("calculateSaleTotals", () => {
  test("calcula uma venda com um item", () => {
    const result = calculateSaleTotals({
      items: [baseItem],
      discountCents: 0,
      deliveryFeeCents: 0,
    });

    expect(result.subtotalCents).toBe(3500);
    expect(result.totalCents).toBe(3500);
    expect(result.estimatedCostCents).toBe(1200);
    expect(result.estimatedProfitCents).toBe(2300);
    expect(result.items[0]).toMatchObject({
      subtotalCents: 3500,
      estimatedCostCents: 1200,
      estimatedProfitCents: 2300,
    });
  });

  test("calcula varios itens, desconto e taxa de entrega", () => {
    const result = calculateSaleTotals({
      items: [
        { ...baseItem, quantity: 2 },
        {
          ...baseItem,
          productId: "produto-2",
          productName: "Sache perfumado",
          quantity: 3,
          unitPriceCents: 1200,
          unitCostCents: 450,
        },
      ],
      discountCents: 1000,
      deliveryFeeCents: 1500,
    });

    expect(result.subtotalCents).toBe(10600);
    expect(result.totalCents).toBe(11100);
    expect(result.estimatedCostCents).toBe(3750);
    expect(result.estimatedProfitCents).toBe(7350);
  });

  test("permite lucro negativo quando a venda fica abaixo do custo", () => {
    const result = calculateSaleTotals({
      items: [{ ...baseItem, unitPriceCents: 900, unitCostCents: 1200 }],
      discountCents: 0,
      deliveryFeeCents: 0,
    });

    expect(result.totalCents).toBe(900);
    expect(result.estimatedProfitCents).toBe(-300);
  });

  test("rejeita quantidade zero", () => {
    expect(() =>
      calculateSaleTotals({
        items: [{ ...baseItem, quantity: 0 }],
        discountCents: 0,
        deliveryFeeCents: 0,
      }),
    ).toThrow("A quantidade precisa ser maior que zero.");
  });

  test("rejeita total negativo", () => {
    expect(() =>
      calculateSaleTotals({
        items: [baseItem],
        discountCents: 5000,
        deliveryFeeCents: 0,
      }),
    ).toThrow("O total da venda nao pode ficar negativo.");
  });

  test("mantem os snapshots do produto usados na venda", () => {
    const result = calculateSaleTotals({
      items: [
        {
          ...baseItem,
          productName: "Nome da data da venda",
          saleUnit: "caixa",
          unitCostCents: 1111,
          minimumPriceCents: 2222,
          recommendedPriceCents: 3333,
        },
      ],
      discountCents: 0,
      deliveryFeeCents: 0,
    });

    expect(result.items[0]).toMatchObject({
      productName: "Nome da data da venda",
      saleUnit: "caixa",
      unitCostCents: 1111,
      minimumPriceCents: 2222,
      recommendedPriceCents: 3333,
    });
  });

  test("arredonda centavos quando quantidade decimal aparece no calculo", () => {
    const result = calculateSaleTotals({
      items: [{ ...baseItem, quantity: 1.5, unitPriceCents: 999, unitCostCents: 333 }],
      discountCents: 0,
      deliveryFeeCents: 0,
    });

    expect(result.items[0]?.subtotalCents).toBe(1499);
    expect(result.items[0]?.estimatedCostCents).toBe(500);
    expect(result.estimatedProfitCents).toBe(999);
  });
});
