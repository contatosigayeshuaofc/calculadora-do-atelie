import { describe, expect, it } from "vitest";
import { inferProductMultipliers } from "./product-multipliers";

describe("inferProductMultipliers", () => {
  it("keeps the product saved prices as its edit multipliers", () => {
    expect(
      inferProductMultipliers({
        minimumPriceCents: 1800,
        recommendedPriceCents: 2400,
        unitCostCents: 1200,
      }),
    ).toEqual({
      minimumMultiplier: 1.5,
      recommendedMultiplier: 2,
    });
  });

  it("falls back to current settings when the product has no unit cost yet", () => {
    expect(
      inferProductMultipliers(
        {
          minimumPriceCents: 0,
          recommendedPriceCents: 0,
          unitCostCents: 0,
        },
        {
          minimumMultiplier: 1.8,
          recommendedMultiplier: 2.3,
        },
      ),
    ).toEqual({
      minimumMultiplier: 1.8,
      recommendedMultiplier: 2.3,
    });
  });
});
