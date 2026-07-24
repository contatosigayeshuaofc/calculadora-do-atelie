type ProductMultiplierSource = {
  minimumPriceCents: number;
  recommendedPriceCents: number;
  unitCostCents: number;
};

type Multipliers = {
  minimumMultiplier: number;
  recommendedMultiplier: number;
};

function roundMultiplier(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function inferProductMultipliers(
  product: ProductMultiplierSource,
  fallback: Multipliers = {
    minimumMultiplier: 1.5,
    recommendedMultiplier: 2,
  },
): Multipliers {
  if (product.unitCostCents <= 0) {
    return fallback;
  }

  return {
    minimumMultiplier: roundMultiplier(
      product.minimumPriceCents / product.unitCostCents,
    ),
    recommendedMultiplier: roundMultiplier(
      product.recommendedPriceCents / product.unitCostCents,
    ),
  };
}
