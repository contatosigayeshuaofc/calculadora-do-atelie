import { requireActiveUser } from "@/lib/auth/require-active-user";
import type {
  SaleCustomerOption,
  SaleDetail,
  SaleListItem,
  SaleProductOption,
} from "./types";
import type { OrderStatus, PaymentStatus } from "@/types/database";

type SaleListFilters = {
  search?: string;
  status?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
};

type SaleListRow = {
  id: string;
  user_id: string;
  customer_id: string | null;
  order_date: string;
  delivery_date: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  subtotal_cents: number;
  discount_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  estimated_cost_cents: number;
  estimated_profit_cents: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customers: { name: string } | null;
  sale_items: { id: string }[];
};

export async function listSales({
  paymentStatus,
  search,
  status,
}: SaleListFilters = {}): Promise<SaleListItem[]> {
  const { supabase } = await requireActiveUser();
  let query = supabase
    .from("sales")
    .select("*, customers(name), sale_items(id)")
    .order("order_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (paymentStatus) {
    query = query.eq("payment_status", paymentStatus);
  }

  const normalizedSearch = search?.trim();
  if (normalizedSearch) {
    query = query.or(
      `id.ilike.%${normalizedSearch}%,customers.name.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as SaleListRow[]).map((sale) => ({
    ...sale,
    customer_name: sale.customers?.name ?? null,
    item_count: sale.sale_items.length,
  }));
}

export async function getSaleDetail(saleId: string): Promise<SaleDetail | null> {
  const { supabase } = await requireActiveUser();
  const { data, error } = await supabase
    .from("sales")
    .select("*, customers(*), sale_items(*)")
    .eq("id", saleId)
    .order("created_at", {
      referencedTable: "sale_items",
      ascending: true,
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as SaleDetail & { customers: SaleDetail["customer"] };

  return {
    ...row,
    customer: row.customers,
  };
}

export async function getSaleFormOptions(): Promise<{
  customers: SaleCustomerOption[];
  products: SaleProductOption[];
}> {
  const { supabase } = await requireActiveUser();
  const [customersResponse, productsResponse] = await Promise.all([
    supabase.from("customers").select("id, name").order("name"),
    supabase
      .from("products")
      .select(
        "id, name, sale_unit, selling_price_cents, unit_cost_cents, minimum_price_cents, recommended_price_cents",
      )
      .eq("is_active", true)
      .order("name"),
  ]);

  if (customersResponse.error) {
    throw new Error(customersResponse.error.message);
  }

  if (productsResponse.error) {
    throw new Error(productsResponse.error.message);
  }

  return {
    customers: customersResponse.data ?? [],
    products: productsResponse.data ?? [],
  };
}
