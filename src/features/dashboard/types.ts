import type { OrderStatus, PaymentStatus } from "@/types/database";

export type DashboardSaleItemInput = {
  productId: string | null;
  productName: string;
  quantity: number;
  subtotalCents: number;
};

export type DashboardSaleInput = {
  id?: string;
  customerId: string | null;
  customerName: string | null;
  deliveryDate: string | null;
  estimatedProfitCents: number;
  items: DashboardSaleItemInput[];
  orderDate: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  totalCents: number;
};

export type DashboardSummary = {
  activeOrderCount: number;
  averageTicketCents: number;
  customerCount: number;
  estimatedProfitCents: number;
  itemQuantity: number;
  orderCount: number;
  pendingAmountCents: number;
  pendingAmountIsApproximate: boolean;
  periodEnd: string;
  periodStart: string;
  recentSales: DashboardSaleInput[];
  revenueCents: number;
  topCustomers: DashboardTopCustomer[];
  topProducts: DashboardTopProduct[];
  upcomingDeliveries: DashboardSaleInput[];
};

export type DashboardTopCustomer = {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalCents: number;
};

export type DashboardTopProduct = {
  productId: string;
  productName: string;
  quantity: number;
  totalCents: number;
};
