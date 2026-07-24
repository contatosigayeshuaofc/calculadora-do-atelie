export type PricingCostItemInput = {
  name: string;
  purchasedQuantity: number;
  purchasePriceCents: number;
  usedQuantity: number;
  unit: string;
};

export type ProductPricingInput = {
  producedQuantity: number;
  packagingCostPerUnitCents: number;
  otherDirectCostsCents: number;
  minimumMultiplier: number;
  recommendedMultiplier: number;
  practicedPriceCents: number;
  costItems: PricingCostItemInput[];
};

export type PricingCostItemResult = PricingCostItemInput & {
  usedCostCents: number;
};

export type ProductPricingResult = {
  costItems: PricingCostItemResult[];
  materialsCostCents: number;
  packagingCostCents: number;
  totalCostCents: number;
  unitCostCents: number;
  minimumPriceCents: number;
  recommendedPriceCents: number;
  estimatedProfitCents: number;
  isBelowMinimumPrice: boolean;
  isBelowCost: boolean;
};
