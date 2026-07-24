import { requireActiveUser } from "@/lib/auth/require-active-user";
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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { supabase } = await requireActiveUser();
  const today = getTodayText();
  const { periodStart, periodEnd } = getCurrentMonthPeriod(today);
  const deliveryEnd = addDays(today, 7);

  const [periodResponse, deliveryResponse] = await Promise.all([
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
  ]);

  if (periodResponse.error) {
    throw new Error(periodResponse.error.message);
  }

  if (deliveryResponse.error) {
    throw new Error(deliveryResponse.error.message);
  }

  const sales = mergeSales([
    ...((periodResponse.data ?? []) as unknown as DashboardSaleRow[]),
    ...((deliveryResponse.data ?? []) as unknown as DashboardSaleRow[]),
  ]);

  return calculateDashboardMetrics({
    periodEnd,
    periodStart,
    sales,
    today,
  });
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

function addDays(dateText: string, days: number) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
