import type { Database } from "@/types/database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductCostItemRow =
  Database["public"]["Tables"]["product_cost_items"]["Row"];

export type ProductListItem = ProductRow;

export type ProductDetail = ProductRow & {
  product_cost_items: ProductCostItemRow[];
};

export type ProductActionState = {
  status: "idle" | "error";
  message: string | null;
};
