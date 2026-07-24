import type {
  DashboardSaleInput,
  DashboardSummary,
  DashboardTopCustomer,
  DashboardTopProduct,
} from "./types";

type CalculateDashboardMetricsInput = {
  periodEnd: string;
  periodStart: string;
  sales: DashboardSaleInput[];
  today: string;
};

const financialStatuses = new Set([
  "awaiting_payment",
  "confirmed",
  "in_production",
  "ready",
  "delivered",
]);

const activeStatuses = new Set([
  "awaiting_payment",
  "confirmed",
  "in_production",
  "ready",
]);

export function calculateDashboardMetrics({
  periodEnd,
  periodStart,
  sales,
  today,
}: CalculateDashboardMetricsInput): DashboardSummary {
  const periodSales = sales.filter(
    (sale) => sale.orderDate >= periodStart && sale.orderDate <= periodEnd,
  );
  const financialSales = periodSales.filter((sale) =>
    financialStatuses.has(sale.status),
  );
  const nonCanceledSales = periodSales.filter((sale) => sale.status !== "canceled");

  const revenueCents = sum(financialSales.map((sale) => sale.totalCents));
  const estimatedProfitCents = sum(
    financialSales.map((sale) => sale.estimatedProfitCents),
  );
  const orderCount = financialSales.length;
  const itemQuantity = sum(
    financialSales.flatMap((sale) => sale.items.map((item) => item.quantity)),
  );
  const customerCount = new Set(
    financialSales
      .map((sale) => sale.customerId)
      .filter((customerId): customerId is string => Boolean(customerId)),
  ).size;
  const pendingSales = nonCanceledSales.filter(
    (sale) => sale.paymentStatus !== "paid",
  );
  const pendingAmountCents = sum(pendingSales.map((sale) => sale.totalCents));

  return {
    activeOrderCount: periodSales.filter((sale) => activeStatuses.has(sale.status))
      .length,
    averageTicketCents:
      orderCount === 0 ? 0 : Math.round(revenueCents / orderCount),
    customerCount,
    estimatedProfitCents,
    itemQuantity,
    orderCount,
    pendingAmountCents,
    pendingAmountIsApproximate: pendingSales.some(
      (sale) => sale.paymentStatus === "partially_paid",
    ),
    periodEnd,
    periodStart,
    recentSales: sortByDateDesc(periodSales).slice(0, 5),
    revenueCents,
    topCustomers: buildTopCustomers(financialSales),
    topProducts: buildTopProducts(financialSales),
    upcomingDeliveries: buildUpcomingDeliveries(sales, today),
  };
}

function buildTopProducts(sales: DashboardSaleInput[]): DashboardTopProduct[] {
  const products = new Map<string, DashboardTopProduct>();

  for (const sale of sales) {
    for (const item of sale.items) {
      const productId = item.productId ?? item.productName;
      const current = products.get(productId) ?? {
        productId,
        productName: item.productName,
        quantity: 0,
        totalCents: 0,
      };

      products.set(productId, {
        ...current,
        quantity: current.quantity + item.quantity,
        totalCents: current.totalCents + item.subtotalCents,
      });
    }
  }

  return [...products.values()]
    .sort((a, b) => b.quantity - a.quantity || b.totalCents - a.totalCents)
    .slice(0, 5);
}

function buildTopCustomers(sales: DashboardSaleInput[]): DashboardTopCustomer[] {
  const customers = new Map<string, DashboardTopCustomer>();

  for (const sale of sales) {
    if (!sale.customerId) {
      continue;
    }

    const current = customers.get(sale.customerId) ?? {
      customerId: sale.customerId,
      customerName: sale.customerName ?? "Cliente sem nome",
      orderCount: 0,
      totalCents: 0,
    };

    customers.set(sale.customerId, {
      ...current,
      orderCount: current.orderCount + 1,
      totalCents: current.totalCents + sale.totalCents,
    });
  }

  return [...customers.values()]
    .sort((a, b) => b.totalCents - a.totalCents || b.orderCount - a.orderCount)
    .slice(0, 5);
}

function buildUpcomingDeliveries(
  sales: DashboardSaleInput[],
  today: string,
): DashboardSaleInput[] {
  const deliveryLimit = addDays(today, 7);

  return sales
    .filter(
      (sale) =>
        sale.status !== "canceled" &&
        sale.deliveryDate !== null &&
        sale.deliveryDate >= today &&
        sale.deliveryDate <= deliveryLimit,
    )
    .sort((a, b) => (a.deliveryDate ?? "").localeCompare(b.deliveryDate ?? ""))
    .slice(0, 5);
}

function sortByDateDesc(sales: DashboardSaleInput[]) {
  return [...sales].sort(
    (a, b) =>
      b.orderDate.localeCompare(a.orderDate) ||
      (b.id ?? "").localeCompare(a.id ?? ""),
  );
}

function addDays(dateText: string, days: number) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
