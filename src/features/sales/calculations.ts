export type SaleCalculationItemInput = {
  productId: string;
  productName: string;
  saleUnit: string;
  quantity: number;
  unitPriceCents: number;
  unitCostCents: number;
  minimumPriceCents: number;
  recommendedPriceCents: number;
};

export type SaleCalculationInput = {
  items: SaleCalculationItemInput[];
  discountCents: number;
  deliveryFeeCents: number;
};

export type SaleCalculationItemResult = SaleCalculationItemInput & {
  subtotalCents: number;
  estimatedCostCents: number;
  estimatedProfitCents: number;
};

export type SaleCalculationResult = {
  items: SaleCalculationItemResult[];
  subtotalCents: number;
  discountCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  estimatedCostCents: number;
  estimatedProfitCents: number;
};

export function calculateSaleTotals(
  input: SaleCalculationInput,
): SaleCalculationResult {
  validateSaleCalculation(input);

  const items = input.items.map((item) => {
    const subtotalCents = roundCents(item.unitPriceCents * item.quantity);
    const estimatedCostCents = roundCents(item.unitCostCents * item.quantity);

    return {
      ...item,
      subtotalCents,
      estimatedCostCents,
      estimatedProfitCents: subtotalCents - estimatedCostCents,
    };
  });
  const subtotalCents = items.reduce(
    (total, item) => total + item.subtotalCents,
    0,
  );
  const estimatedCostCents = items.reduce(
    (total, item) => total + item.estimatedCostCents,
    0,
  );
  const totalCents =
    subtotalCents - input.discountCents + input.deliveryFeeCents;

  if (totalCents < 0) {
    throw new Error("O total da venda nao pode ficar negativo.");
  }

  return {
    items,
    subtotalCents,
    discountCents: input.discountCents,
    deliveryFeeCents: input.deliveryFeeCents,
    totalCents,
    estimatedCostCents,
    estimatedProfitCents: totalCents - estimatedCostCents,
  };
}

function validateSaleCalculation(input: SaleCalculationInput) {
  if (input.items.length === 0) {
    throw new Error("Adicione pelo menos um produto a venda.");
  }

  if (input.discountCents < 0) {
    throw new Error("O desconto nao pode ser negativo.");
  }

  if (input.deliveryFeeCents < 0) {
    throw new Error("A taxa de entrega nao pode ser negativa.");
  }

  for (const item of input.items) {
    if (item.quantity <= 0) {
      throw new Error("A quantidade precisa ser maior que zero.");
    }

    if (item.unitPriceCents < 0 || item.unitCostCents < 0) {
      throw new Error("Os valores dos produtos nao podem ser negativos.");
    }
  }
}

function roundCents(value: number) {
  return Math.round(value);
}
