import { requireActiveUser } from "@/lib/auth/require-active-user";
import type { ProductDetail, ProductListItem } from "./types";

export type ProductListFilters = {
  search?: string;
  includeArchived?: boolean;
};

export async function listProducts({
  includeArchived = false,
  search,
}: ProductListFilters = {}): Promise<ProductListItem[]> {
  const { supabase } = await requireActiveUser();
  let query = supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (!includeArchived) {
    query = query.eq("is_active", true);
  }

  const normalizedSearch = search?.trim();
  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,category.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProductDetail(
  productId: string,
): Promise<ProductDetail | null> {
  const { supabase } = await requireActiveUser();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_cost_items(*)")
    .eq("id", productId)
    .order("sort_order", {
      referencedTable: "product_cost_items",
      ascending: true,
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProductDetail | null;
}

export async function getProductPricingSettings() {
  const { supabase, user } = await requireActiveUser();
  const { data, error } = await supabase
    .from("user_settings")
    .select("minimum_price_multiplier, recommended_price_multiplier")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    minimumMultiplier: Number(data?.minimum_price_multiplier ?? 1.5),
    recommendedMultiplier: Number(data?.recommended_price_multiplier ?? 2),
  };
}
