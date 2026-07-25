"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateSaleTotals } from "@/features/sales/calculations";
import { requireActiveUser } from "@/lib/auth/require-active-user";
import type { Json } from "@/types/database";
import {
  getSaleFormError,
  parseSaleFormData,
  parseSaleUpdateData,
} from "./schemas";
import type { SaleActionState } from "./types";

export async function saveSaleAction(
  _previousState: SaleActionState,
  formData: FormData,
): Promise<SaleActionState> {
  let saleId: string;

  try {
    const payload = formData.get("payload");

    if (typeof payload !== "string") {
      throw new Error("Não foi possível ler os dados da venda.");
    }

    const sale = parseSaleFormData(JSON.parse(payload));
    const { supabase } = await requireActiveUser();
    const productIds = [...new Set(sale.items.map((item) => item.productId))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        "id, name, sale_unit, selling_price_cents, unit_cost_cents, minimum_price_cents, recommended_price_cents",
      )
      .eq("is_active", true)
      .in("id", productIds);

    if (productsError) {
      throw new Error(productsError.message);
    }

    if ((products ?? []).length !== productIds.length) {
      throw new Error("Um dos produtos selecionados não está disponível.");
    }

    const productById = new Map((products ?? []).map((product) => [product.id, product]));
    const calculation = calculateSaleTotals({
      discountCents: sale.discountCents,
      deliveryFeeCents: sale.deliveryFeeCents,
      items: sale.items.map((item) => {
        const product = productById.get(item.productId);

        if (!product) {
          throw new Error("Produto não encontrado.");
        }

        return {
          productId: product.id,
          productName: product.name,
          saleUnit: product.sale_unit,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          unitCostCents: product.unit_cost_cents,
          minimumPriceCents: product.minimum_price_cents,
          recommendedPriceCents: product.recommended_price_cents,
        };
      }),
    });

    const { data, error } = await supabase.rpc("create_sale_with_items", {
      p_customer_id: sale.customerId,
      p_order_date: sale.orderDate,
      p_delivery_date: sale.deliveryDate,
      p_status: sale.status,
      p_payment_status: sale.paymentStatus,
      p_payment_method: sale.paymentMethod,
      p_discount_cents: calculation.discountCents,
      p_delivery_fee_cents: calculation.deliveryFeeCents,
      p_items: calculation.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
      })) as Json,
      p_notes: sale.notes,
    });

    if (error) {
      throw new Error(error.message);
    }

    saleId = data;
  } catch (error) {
    return {
      status: "error",
      message: getSaleFormError(error),
    };
  }

  revalidateSales(saleId);
  redirect(`/vendas/${saleId}` as never);
}

export async function updateSaleAction(
  _previousState: SaleActionState,
  formData: FormData,
): Promise<SaleActionState> {
  let saleId: string;

  try {
    const payload = formData.get("payload");

    if (typeof payload !== "string") {
      throw new Error("Não foi possível ler os dados da venda.");
    }

    const sale = parseSaleUpdateData(JSON.parse(payload));
    const { supabase } = await requireActiveUser();
    const { data, error } = await supabase
      .from("sales")
      .update({
        order_date: sale.orderDate,
        delivery_date: sale.deliveryDate,
        status: sale.status,
        payment_status: sale.paymentStatus,
        payment_method: sale.paymentMethod,
        notes: sale.notes,
      })
      .eq("id", sale.saleId)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    saleId = data.id;
  } catch (error) {
    return {
      status: "error",
      message: getSaleFormError(error),
    };
  }

  revalidateSales(saleId);
  redirect(`/vendas/${saleId}` as never);
}

function revalidateSales(saleId: string) {
  revalidatePath("/vendas");
  revalidatePath(`/vendas/${saleId}` as never);
  revalidatePath(`/vendas/${saleId}/editar` as never);
  revalidatePath("/clientes");
  revalidatePath("/painel");
}
