import type {
  PricingCostItemInput,
  ProductPricingInput,
  ProductPricingResult,
} from "./types";

export function calculateProductPricing(
  input: ProductPricingInput,
): ProductPricingResult {
  validateInput(input);

  const costItems = input.costItems.map((item) => ({
    ...item,
    usedCostCents: calculateCostItemCents(item),
  }));
  const materialsCostCents = costItems.reduce(
    (total, item) => total + item.usedCostCents,
    0,
  );
  const packagingCostCents = roundCents(
    input.packagingCostPerUnitCents * input.producedQuantity,
  );
  const totalCostCents =
    materialsCostCents + packagingCostCents + input.otherDirectCostsCents;
  const unitCostCents = roundCents(totalCostCents / input.producedQuantity);
  const minimumPriceCents = roundCents(
    unitCostCents * input.minimumMultiplier,
  );
  const recommendedPriceCents = roundCents(
    unitCostCents * input.recommendedMultiplier,
  );
  const estimatedProfitCents = roundCents(
    input.practicedPriceCents - unitCostCents,
  );

  return {
    costItems,
    materialsCostCents,
    packagingCostCents,
    totalCostCents,
    unitCostCents,
    minimumPriceCents,
    recommendedPriceCents,
    estimatedProfitCents,
    isBelowMinimumPrice: input.practicedPriceCents < minimumPriceCents,
    isBelowCost: input.practicedPriceCents < unitCostCents,
  };
}

function calculateCostItemCents(item: PricingCostItemInput): number {
  return roundCents(
    item.purchasePriceCents * (item.usedQuantity / item.purchasedQuantity),
  );
}

function validateInput(input: ProductPricingInput): void {
  if (input.producedQuantity <= 0) {
    throw new Error("Informe um rendimento do lote maior que zero.");
  }

  if (input.recommendedMultiplier < input.minimumMultiplier) {
    throw new Error("O preco recomendado nao pode ser menor que o minimo.");
  }

  for (const item of input.costItems) {
    if (item.purchasedQuantity <= 0) {
      throw new Error("Informe a quantidade comprada maior que zero.");
    }

    if (item.usedQuantity <= 0) {
      throw new Error("Informe a quantidade utilizada maior que zero.");
    }
  }
}

function roundCents(value: number): number {
  return Math.round(value);
}
