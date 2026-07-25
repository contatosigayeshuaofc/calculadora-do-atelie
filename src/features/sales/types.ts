import type { Database, OrderStatus, PaymentStatus } from "@/types/database";

export type SaleRow = Database["public"]["Tables"]["sales"]["Row"];
export type SaleItemRow = Database["public"]["Tables"]["sale_items"]["Row"];

export type SaleListItem = SaleRow & {
  customer_name: string | null;
  item_count: number;
};

export const paymentMethodOptions = [
  { label: "Cartão de crédito", value: "Cartão de crédito" },
  { label: "Pix", value: "Pix" },
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Boleto", value: "Boleto" },
] as const;

export type SaleDetail = SaleRow & {
  customer: Database["public"]["Tables"]["customers"]["Row"] | null;
  sale_items: SaleItemRow[];
};

export type SaleActionState = {
  status: "idle" | "error";
  message: string | null;
};

export type SaleProductOption = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  | "id"
  | "name"
  | "sale_unit"
  | "selling_price_cents"
  | "unit_cost_cents"
  | "minimum_price_cents"
  | "recommended_price_cents"
>;

export type SaleCustomerOption = Pick<
  Database["public"]["Tables"]["customers"]["Row"],
  "id" | "name"
>;

export const orderStatusLabels: Record<OrderStatus, string> = {
  quote: "Orçamento",
  awaiting_payment: "Aguardando pagamento",
  confirmed: "Confirmado",
  in_production: "Em produção",
  ready: "Pronto",
  delivered: "Entregue",
  canceled: "Cancelado",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Não pago",
  partially_paid: "Parcialmente pago",
  paid: "Pago",
};
