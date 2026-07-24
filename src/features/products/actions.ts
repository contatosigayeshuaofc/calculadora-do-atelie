"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateProductPricing } from "@/features/pricing/calculate-product-pricing";
import { requireActiveUser } from "@/lib/auth/require-active-user";
import type { Json } from "@/types/database";
import {
  buildProductPricingInput,
  getProductFormError,
  parseProductFormData,
} from "./schemas";
import type { ProductActionState } from "./types";

export async function saveProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  let productId: string;

  try {
    const payload = formData.get("payload");

    if (typeof payload !== "string") {
      throw new Error("Nao foi possivel ler os dados do produto.");
    }

    const product = parseProductFormData(JSON.parse(payload));
    calculateProductPricing(buildProductPricingInput(product));
    const { supabase } = await requireActiveUser();
    const costItems = product.costItems.map((item, index) => ({
      name: item.name,
      unit_measure: item.unitMeasure,
      purchase_quantity: item.purchaseQuantity,
      purchase_price_cents: item.purchasePriceCents,
      used_quantity: item.usedQuantity,
      sort_order: index,
    }));

    const { data, error } = await supabase.rpc(
      "upsert_product_with_cost_items",
      {
        p_product_id: product.productId ?? null,
        p_name: product.name,
        p_category: product.category,
        p_description: product.description,
        p_sale_unit: product.saleUnit,
        p_batch_yield: product.batchYield,
        p_packaging_cost_per_unit_cents:
          product.packagingCostPerUnitCents,
        p_additional_batch_cost_cents: product.additionalBatchCostCents,
        p_selling_price_cents: product.sellingPriceCents,
        p_minimum_multiplier: product.minimumMultiplier,
        p_recommended_multiplier: product.recommendedMultiplier,
        p_cost_items: costItems as Json,
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    productId = data;

  } catch (error) {
    return {
      status: "error",
      message: getProductFormError(error),
    };
  }

  revalidateProducts(productId);
  redirect(`/produtos/${productId}` as never);
}

export async function archiveProductAction(formData: FormData) {
  await setProductActive(formData, false);
}

export async function restoreProductAction(formData: FormData) {
  await setProductActive(formData, true);
}

async function setProductActive(formData: FormData, isActive: boolean) {
  const productId = formData.get("productId");

  if (typeof productId !== "string") {
    throw new Error("Produto nao informado.");
  }

  const { supabase } = await requireActiveUser();
  const { error } = await supabase.rpc("set_product_active", {
    p_product_id: productId,
    p_is_active: isActive,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateProducts(productId);
}

function revalidateProducts(productId: string) {
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${productId}` as never);
  revalidatePath(`/produtos/${productId}/editar` as never);
  revalidatePath("/painel");
}
