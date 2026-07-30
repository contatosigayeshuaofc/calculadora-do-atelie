import { requireActiveUser } from "@/lib/auth/require-active-user";
import { normalizeCurrencyCode } from "@/lib/currency/supported-currencies";
import { calculateDashboardMetrics } from "./calculations";
import type { DashboardSaleInput, DashboardSummary } from "./types";
import type { OrderStatus, PaymentStatus } from "@/types/database";

type DashboardSaleRow = {
  id: string;
  customer_id: string | null;
  order_date: string;
  delivery_date: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_cents: number;
  estimated_profit_cents: number;
  created_at: string;
  customers: { name: string } | null;
  sale_items: DashboardSaleItemRow[];
};

type DashboardSaleItemRow = {
  product_id: string | null;
  product_name_snapshot: string;
  quantity: number;
  subtotal_cents: number;
};

type DashboardSummaryFilters = {
  periodEnd?: string;
  periodStart?: string;
};

export async function getDashboardSummary({
  periodEnd: requestedPeriodEnd,
  periodStart: requestedPeriodStart,
}: DashboardSummaryFilters = {}): Promise<DashboardSummary> {
  const { supabase, user } = await requireActiveUser();
  const today = getTodayText();
  const defaultPeriod = getCurrentMonthPeriod(today);
  const rawPeriodStart = isDateText(requestedPeriodStart)
    ? requestedPeriodStart
    : defaultPeriod.periodStart;
  const rawPeriodEnd = isDateText(requestedPeriodEnd)
    ? requestedPeriodEnd
    : defaultPeriod.periodEnd;
  const periodStart =
    rawPeriodStart <= rawPeriodEnd ? rawPeriodStart : rawPeriodEnd;
  const periodEnd = rawPeriodStart <= rawPeriodEnd ? rawPeriodEnd : rawPeriodStart;
  const deliveryEnd = addDays(today, 7);

  const [periodResponse, deliveryResponse, settingsResponse] = await Promise.all([
    supabase
      .from("sales")
      .select(
        "id, customer_id, order_date, delivery_date, status, payment_status, total_cents, estimated_profit_cents, created_at, customers(name), sale_items(product_id, product_name_snapshot, quantity, subtotal_cents)",
      )
      .gte("order_date", periodStart)
      .lte("order_date", periodEnd)
      .order("order_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("sales")
      .select(
        "id, customer_id, order_date, delivery_date, status, payment_status, total_cents, estimated_profit_cents, created_at, customers(name), sale_items(product_id, product_name_snapshot, quantity, subtotal_cents)",
      )
      .gte("delivery_date", today)
      .lte("delivery_date", deliveryEnd)
      .order("delivery_date", { ascending: true }),
    supabase
      .from("user_settings")
      .select("currency_code")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (periodResponse.error) {
    throw new Error(periodResponse.error.message);
  }

  if (deliveryResponse.error) {
    throw new Error(deliveryResponse.error.message);
  }

  if (settingsResponse.error) {
    throw new Error(settingsResponse.error.message);
  }

  const sales = mergeSales([
    ...((periodResponse.data ?? []) as unknown as DashboardSaleRow[]),
    ...((deliveryResponse.data ?? []) as unknown as DashboardSaleRow[]),
  ]);

  return {
    ...calculateDashboardMetrics({
    periodEnd,
    periodStart,
    sales,
    today,
    }),
    currencyCode: normalizeCurrencyCode(settingsResponse.data?.currency_code),
  };
}

function mergeSales(rows: DashboardSaleRow[]): DashboardSaleInput[] {
  const sales = new Map<string, DashboardSaleInput>();

  for (const row of rows) {
    sales.set(row.id, mapSale(row));
  }

  return [...sales.values()];
}

function mapSale(row: DashboardSaleRow): DashboardSaleInput {
  return {
    customerId: row.customer_id,
    customerName: row.customers?.name ?? null,
    deliveryDate: row.delivery_date,
    estimatedProfitCents: row.estimated_profit_cents,
    id: row.id,
    items: row.sale_items.map((item) => ({
      productId: item.product_id,
      productName: item.product_name_snapshot,
      quantity: item.quantity,
      subtotalCents: item.subtotal_cents,
    })),
    orderDate: row.order_date,
    paymentStatus: row.payment_status,
    status: row.status,
    totalCents: row.total_cents,
  };
}

function getTodayText() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

function getCurrentMonthPeriod(today: string) {
  const [year, month] = today.split("-").map(Number);
  const periodStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const periodEndDate = new Date(Date.UTC(year, month, 0));

  return {
    periodEnd: periodEndDate.toISOString().slice(0, 10),
    periodStart,
  };
}

function isDateText(value: string | undefined): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addDays(dateText: string, days: number) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
