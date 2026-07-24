import { requireActiveUser } from "@/lib/auth/require-active-user";
import { buildEmptyCustomerSummary } from "./schemas";
import type { CustomerDetail, CustomerListItem, CustomerRow } from "./types";

type SaleSummaryRow = {
  customer_id: string | null;
  order_date: string;
  total_cents: number;
};

export type CustomerListFilters = {
  search?: string;
};

export async function listCustomers({
  search,
}: CustomerListFilters = {}): Promise<CustomerListItem[]> {
  const { supabase } = await requireActiveUser();
  let query = supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false });

  const normalizedSearch = search?.trim();
  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,city.ilike.%${normalizedSearch}%,instagram.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const customers = data ?? [];
  const summaries = await getSalesSummaries(
    customers.map((customer) => customer.id),
  );

  return customers.map((customer) => ({
    ...customer,
    summary: summaries.get(customer.id) ?? buildEmptyCustomerSummary(),
  }));
}

export async function getCustomerDetail(
  customerId: string,
): Promise<CustomerDetail | null> {
  const { supabase } = await requireActiveUser();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const summaries = await getSalesSummaries([customerId]);

  return {
    ...(data as CustomerRow),
    summary: summaries.get(customerId) ?? buildEmptyCustomerSummary(),
  };
}

async function getSalesSummaries(customerIds: string[]) {
  const summaries = new Map<string, ReturnType<typeof buildEmptyCustomerSummary>>();

  if (customerIds.length === 0) {
    return summaries;
  }

  const { supabase } = await requireActiveUser();
  const { data, error } = await supabase
    .from("sales")
    .select("customer_id, order_date, total_cents")
    .in("customer_id", customerIds)
    .neq("status", "canceled");

  if (error) {
    throw new Error(error.message);
  }

  for (const sale of (data ?? []) as SaleSummaryRow[]) {
    if (!sale.customer_id) {
      continue;
    }

    const current = summaries.get(sale.customer_id) ?? buildEmptyCustomerSummary();
    const nextDate =
      !current.lastOrderDate || sale.order_date > current.lastOrderDate
        ? sale.order_date
        : current.lastOrderDate;

    summaries.set(sale.customer_id, {
      orderCount: current.orderCount + 1,
      totalSpentCents: current.totalSpentCents + sale.total_cents,
      lastOrderDate: nextDate,
    });
  }

  return summaries;
}
