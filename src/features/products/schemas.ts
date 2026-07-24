import { z } from "zod";
import type { ProductPricingInput } from "@/features/pricing/types";
import { parseCurrencyInput } from "@/lib/currency/parse-currency-input";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";

const positiveNumberFromString = (field: string) =>
  z.coerce.number({ error: `${field} precisa ser informado.` }).positive({
    message: `${field} precisa ser maior que zero.`,
  });

const multiplierFromString = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} precisa ser informado.`)
    .transform((value) => Number(value.replace(",", ".")))
    .pipe(z.number().positive(`${field} precisa ser maior que zero.`));

const moneyFromString = z
  .string()
  .default("")
  .transform((value) => parseCurrencyInput(value));

export const productCostItemFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do custo."),
  unitMeasure: z.string().trim().min(1, "Informe a unidade."),
  purchaseQuantity: positiveNumberFromString("Quantidade comprada"),
  purchasePrice: moneyFromString,
  usedQuantity: positiveNumberFromString("Quantidade usada"),
});

export const productFormSchema = z
  .object({
    productId: z.string().uuid().optional().or(z.literal("")),
    name: z.string().trim().min(1, "Informe o nome do produto."),
    category: z.string().trim().optional().default(""),
    description: z.string().trim().optional().default(""),
    saleUnit: z.string().trim().min(1, "Informe a unidade de venda."),
    batchYield: positiveNumberFromString("Rendimento do lote"),
    packagingCostPerUnit: moneyFromString,
    additionalBatchCost: moneyFromString,
    sellingPrice: moneyFromString,
    minimumMultiplier: multiplierFromString("Multiplicador minimo"),
    recommendedMultiplier: multiplierFromString("Multiplicador recomendado"),
    costItems: z
      .array(productCostItemFormSchema)
      .min(1, "Adicione pelo menos um custo."),
  })
  .superRefine((value, context) => {
    if (value.recommendedMultiplier < value.minimumMultiplier) {
      context.addIssue({
        code: "custom",
        message:
          "O multiplicador recomendado precisa ser igual ou maior que o minimo.",
        path: ["recommendedMultiplier"],
      });
    }
  })
  .transform((value) => ({
    productId: value.productId || undefined,
    name: value.name,
    category: value.category || null,
    description: value.description || null,
    saleUnit: value.saleUnit,
    batchYield: value.batchYield,
    packagingCostPerUnitCents: value.packagingCostPerUnit,
    additionalBatchCostCents: value.additionalBatchCost,
    sellingPriceCents: value.sellingPrice,
    minimumMultiplier: value.minimumMultiplier,
    recommendedMultiplier: value.recommendedMultiplier,
    costItems: value.costItems.map((item) => ({
      name: item.name,
      unitMeasure: item.unitMeasure,
      purchaseQuantity: item.purchaseQuantity,
      purchasePriceCents: item.purchasePrice,
      usedQuantity: item.usedQuantity,
    })),
  }));

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export function parseProductFormData(input: unknown): ProductFormValues {
  return productFormSchema.parse(input);
}

export function buildProductPricingInput(
  product: ProductFormValues,
): ProductPricingInput {
  return {
    producedQuantity: product.batchYield,
    packagingCostPerUnitCents: product.packagingCostPerUnitCents,
    otherDirectCostsCents: product.additionalBatchCostCents,
    minimumMultiplier: product.minimumMultiplier,
    recommendedMultiplier: product.recommendedMultiplier,
    practicedPriceCents: product.sellingPriceCents,
    costItems: product.costItems.map((item) => ({
      name: item.name,
      purchasedQuantity: item.purchaseQuantity,
      purchasePriceCents: item.purchasePriceCents,
      usedQuantity: item.usedQuantity,
      unit: item.unitMeasure,
    })),
  };
}

export function getProductFormError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados do produto.";
  }

  if (error instanceof Error) {
    return getUserFacingErrorMessage(error, "Nao foi possivel salvar o produto. Tente novamente.");
  }

  return "Nao foi possivel salvar o produto.";
}
