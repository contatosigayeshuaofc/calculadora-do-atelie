import { describe, expect, test } from "vitest";

import { calculateProductPricing } from "./calculate-product-pricing";
import type { ProductPricingInput } from "./types";

const baseInput: ProductPricingInput = {
  producedQuantity: 10,
  packagingCostPerUnitCents: 50,
  otherDirectCostsCents: 300,
  minimumMultiplier: 1.5,
  recommendedMultiplier: 2,
  practicedPriceCents: 500,
  costItems: [
    {
      name: "Gesso",
      purchasedQuantity: 5000,
      purchasePriceCents: 2500,
      usedQuantity: 500,
      unit: "g",
    },
  ],
};

describe("calculateProductPricing", () => {
  test("calculates proportional material cost for a purchased quantity", () => {
    const result = calculateProductPricing(baseInput);

    expect(result.costItems[0]?.usedCostCents).toBe(250);
    expect(result.materialsCostCents).toBe(250);
  });

  test("sums multiple materials in the lot", () => {
    const result = calculateProductPricing({
      ...baseInput,
      costItems: [
        ...baseInput.costItems,
        {
          name: "Pigmento",
          purchasedQuantity: 100,
          purchasePriceCents: 800,
          usedQuantity: 25,
          unit: "g",
        },
      ],
    });

    expect(result.costItems.map((item) => item.usedCostCents)).toEqual([
      250, 200,
    ]);
    expect(result.materialsCostCents).toBe(450);
  });

  test("includes packaging, other direct costs and unit cost", () => {
    const result = calculateProductPricing(baseInput);

    expect(result.packagingCostCents).toBe(500);
    expect(result.totalCostCents).toBe(1050);
    expect(result.unitCostCents).toBe(105);
  });

  test("calculates minimum, recommended and estimated profit from practiced price", () => {
    const result = calculateProductPricing(baseInput);

    expect(result.minimumPriceCents).toBe(158);
    expect(result.recommendedPriceCents).toBe(210);
    expect(result.estimatedProfitCents).toBe(395);
    expect(result.isBelowMinimumPrice).toBe(false);
    expect(result.isBelowCost).toBe(false);
  });

  test("rounds fractional cents in monetary results", () => {
    const result = calculateProductPricing({
      ...baseInput,
      producedQuantity: 3,
      packagingCostPerUnitCents: 0,
      otherDirectCostsCents: 0,
      practicedPriceCents: 200,
      costItems: [
        {
          name: "Essencia",
          purchasedQuantity: 3,
          purchasePriceCents: 100,
          usedQuantity: 1,
          unit: "ml",
        },
      ],
    });

    expect(result.costItems[0]?.usedCostCents).toBe(33);
    expect(result.totalCostCents).toBe(33);
    expect(result.unitCostCents).toBe(11);
    expect(result.minimumPriceCents).toBe(17);
    expect(result.recommendedPriceCents).toBe(22);
    expect(result.estimatedProfitCents).toBe(189);
  });

  test("rejects invalid quantities and multipliers", () => {
    expect(() =>
      calculateProductPricing({ ...baseInput, producedQuantity: 0 }),
    ).toThrow("rendimento do lote");
    expect(() =>
      calculateProductPricing({
        ...baseInput,
        costItems: [{ ...baseInput.costItems[0]!, purchasedQuantity: 0 }],
      }),
    ).toThrow("quantidade comprada");
    expect(() =>
      calculateProductPricing({
        ...baseInput,
        costItems: [{ ...baseInput.costItems[0]!, usedQuantity: 0 }],
      }),
    ).toThrow("quantidade utilizada");
    expect(() =>
      calculateProductPricing({
        ...baseInput,
        minimumMultiplier: 2,
        recommendedMultiplier: 1.5,
      }),
    ).toThrow("recomendado");
  });

  test("keeps negative profit when practiced price is below cost", () => {
    const result = calculateProductPricing({
      ...baseInput,
      practicedPriceCents: 75,
    });

    expect(result.estimatedProfitCents).toBe(-30);
    expect(result.isBelowMinimumPrice).toBe(true);
    expect(result.isBelowCost).toBe(true);
  });
});
