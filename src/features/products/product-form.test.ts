import { describe, expect, it } from "vitest";
import {
  buildProductPricingInput,
  parseProductFormData,
} from "./schemas";
import { getProductFormStepError } from "@/components/products/product-form";

const validFormData = {
  name: "Vela botanica",
  category: "Velas",
  description: "Aromatica",
  saleUnit: "unidade",
  batchYield: "10",
  packagingCostPerUnit: "R$ 0,50",
  additionalBatchCost: "R$ 3,00",
  sellingPrice: "R$ 5,00",
  minimumMultiplier: "1,5",
  recommendedMultiplier: "2",
  costItems: [
    {
      name: "Cera",
      unitMeasure: "g",
      purchaseQuantity: "5000",
      purchasePrice: "R$ 25,00",
      usedQuantity: "500",
    },
    {
      name: "Essencia",
      unitMeasure: "ml",
      purchaseQuantity: "100",
      purchasePrice: "R$ 20,00",
      usedQuantity: "10",
    },
  ],
};

describe("product form schema", () => {
  it("normalizes product form values into safe cents and quantities", () => {
    const parsed = parseProductFormData(validFormData);

    expect(parsed).toMatchObject({
      name: "Vela botanica",
      batchYield: 10,
      packagingCostPerUnitCents: 50,
      additionalBatchCostCents: 300,
      sellingPriceCents: 500,
      minimumMultiplier: 1.5,
      recommendedMultiplier: 2,
    });
    expect(parsed.costItems[0]).toMatchObject({
      name: "Cera",
      purchaseQuantity: 5000,
      purchasePriceCents: 2500,
      usedQuantity: 500,
    });
  });

  it("rejects products without cost items", () => {
    expect(() =>
      parseProductFormData({ ...validFormData, costItems: [] }),
    ).toThrow("Adicione pelo menos um custo");
  });

  it("maps form data to the shared pricing engine input", () => {
    const parsed = parseProductFormData(validFormData);
    const pricingInput = buildProductPricingInput(parsed);

    expect(pricingInput).toEqual({
      producedQuantity: 10,
      packagingCostPerUnitCents: 50,
      otherDirectCostsCents: 300,
      minimumMultiplier: 1.5,
      recommendedMultiplier: 2,
      practicedPriceCents: 500,
      costItems: [
        {
          name: "Cera",
          purchasedQuantity: 5000,
          purchasePriceCents: 2500,
          usedQuantity: 500,
          unit: "g",
        },
        {
          name: "Essencia",
          purchasedQuantity: 100,
          purchasePriceCents: 2000,
          usedQuantity: 10,
          unit: "ml",
        },
      ],
    });
  });

  it("rejects recommended multiplier below minimum multiplier", () => {
    expect(() =>
      parseProductFormData({
        ...validFormData,
        minimumMultiplier: "2",
        recommendedMultiplier: "1,5",
      }),
    ).toThrow("O multiplicador recomendado precisa ser igual ou maior");
  });
});

describe("product form step validation", () => {
  it("asks for the product name before leaving the first step", () => {
    expect(
      getProductFormStepError(
        0,
        {
          ...validFormData,
          productId: "",
          name: "",
          costItems: [],
        },
        [],
      ),
    ).toBe("Informe o nome do produto para continuar.");
  });

  it("allows the first step when product basics are complete", () => {
    expect(
      getProductFormStepError(
        0,
        {
          ...validFormData,
          productId: "",
          costItems: [],
        },
        [],
      ),
    ).toBeNull();
  });

  it("points to the incomplete cost before opening the price step", () => {
    expect(
      getProductFormStepError(
        1,
        {
          ...validFormData,
          productId: "",
          costItems: [],
        },
        [
          {
            name: "Cera",
            unitMeasure: "g",
            purchaseQuantity: "5000",
            purchasePrice: "R$ 25,00",
            usedQuantity: "500",
          },
          {
            name: "",
            unitMeasure: "ml",
            purchaseQuantity: "",
            purchasePrice: "",
            usedQuantity: "",
          },
        ],
      ),
    ).toBe(
      "Complete o custo 2: item, unidade, quantidade comprada, quantidade usada e preço da compra.",
    );
  });
});
