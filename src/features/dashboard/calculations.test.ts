import { describe, expect, test } from "vitest";
import { calculateDashboardMetrics } from "./calculations";
import type { DashboardSaleInput } from "./types";

const baseSale = {
  customerId: "customer-1",
  customerName: "Ana",
  deliveryDate: null,
  estimatedProfitCents: 6000,
  items: [
    {
      productId: "product-1",
      productName: "Vela floral",
      quantity: 2,
      subtotalCents: 12000,
    },
  ],
  orderDate: "2026-07-10",
  paymentStatus: "paid",
  status: "delivered",
  totalCents: 12000,
} satisfies DashboardSaleInput;

describe("calculateDashboardMetrics", () => {
  test("ignores quotes and canceled sales in financial totals", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        baseSale,
        {
          ...baseSale,
          customerId: "customer-2",
          customerName: "Bia",
          status: "quote",
          totalCents: 99900,
        },
        {
          ...baseSale,
          customerId: "customer-3",
          customerName: "Carla",
          status: "canceled",
          totalCents: 45000,
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.revenueCents).toBe(12000);
    expect(dashboard.estimatedProfitCents).toBe(6000);
    expect(dashboard.orderCount).toBe(1);
    expect(dashboard.averageTicketCents).toBe(12000);
  });

  test("counts sold pieces and unique customers for the dashboard highlights", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        baseSale,
        {
          ...baseSale,
          customerId: "customer-1",
          items: [
            {
              productId: "product-2",
              productName: "Home spray",
              quantity: 3,
              subtotalCents: 9000,
            },
          ],
        },
        {
          ...baseSale,
          customerId: "customer-2",
          customerName: "Bia",
          items: [
            {
              productId: "product-3",
              productName: "Difusor",
              quantity: 4,
              subtotalCents: 16000,
            },
          ],
        },
        {
          ...baseSale,
          customerId: "customer-3",
          status: "canceled",
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.itemQuantity).toBe(9);
    expect(dashboard.customerCount).toBe(2);
  });

  test("calculates pending total and active orders with MVP partial-payment approximation", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        {
          ...baseSale,
          paymentStatus: "unpaid",
          status: "awaiting_payment",
          totalCents: 10000,
        },
        {
          ...baseSale,
          customerId: "customer-2",
          paymentStatus: "partially_paid",
          status: "ready",
          totalCents: 20000,
        },
        {
          ...baseSale,
          customerId: "customer-3",
          paymentStatus: "paid",
          status: "confirmed",
          totalCents: 30000,
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.pendingAmountCents).toBe(30000);
    expect(dashboard.activeOrderCount).toBe(3);
    expect(dashboard.pendingAmountIsApproximate).toBe(true);
    expect(dashboard.revenueCents).toBe(30000);
    expect(dashboard.orderCount).toBe(1);
  });

  test("only includes paid sales in revenue and profit totals", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        {
          ...baseSale,
          estimatedProfitCents: 4000,
          paymentStatus: "unpaid",
          status: "confirmed",
          totalCents: 10000,
        },
        {
          ...baseSale,
          customerId: "customer-2",
          estimatedProfitCents: 6000,
          paymentStatus: "paid",
          status: "confirmed",
          totalCents: 15000,
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.revenueCents).toBe(15000);
    expect(dashboard.estimatedProfitCents).toBe(6000);
    expect(dashboard.itemQuantity).toBe(2);
    expect(dashboard.pendingAmountCents).toBe(10000);
  });

  test("ranks products by quantity and customers by valid revenue", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        {
          ...baseSale,
          customerId: "customer-1",
          customerName: "Ana",
          totalCents: 20000,
          items: [
            {
              productId: "product-1",
              productName: "Vela floral",
              quantity: 2,
              subtotalCents: 12000,
            },
            {
              productId: "product-2",
              productName: "Sabonete",
              quantity: 5,
              subtotalCents: 8000,
            },
          ],
        },
        {
          ...baseSale,
          customerId: "customer-2",
          customerName: "Bia",
          totalCents: 35000,
          items: [
            {
              productId: "product-1",
              productName: "Vela floral",
              quantity: 4,
              subtotalCents: 24000,
            },
          ],
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.topProducts[0]).toMatchObject({
      productName: "Vela floral",
      quantity: 6,
    });
    expect(dashboard.topCustomers[0]).toMatchObject({
      customerName: "Bia",
      totalCents: 35000,
    });
  });

  test("lists upcoming deliveries for the next seven days only", () => {
    const dashboard = calculateDashboardMetrics({
      periodEnd: "2026-07-31",
      periodStart: "2026-07-01",
      sales: [
        {
          ...baseSale,
          deliveryDate: "2026-07-24",
          id: "sale-today",
          status: "confirmed",
        },
        {
          ...baseSale,
          deliveryDate: "2026-07-31",
          id: "sale-week",
          status: "ready",
        },
        {
          ...baseSale,
          deliveryDate: "2026-08-01",
          id: "sale-later",
          status: "confirmed",
        },
        {
          ...baseSale,
          deliveryDate: "2026-07-25",
          id: "sale-canceled",
          status: "canceled",
        },
      ],
      today: "2026-07-24",
    });

    expect(dashboard.upcomingDeliveries.map((sale) => sale.id)).toEqual([
      "sale-today",
      "sale-week",
    ]);
  });
});
