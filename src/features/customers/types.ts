import type { Database } from "@/types/database";
import type { CustomerSalesSummary } from "./schemas";

export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];

export type CustomerListItem = CustomerRow & {
  summary: CustomerSalesSummary;
};

export type CustomerDetail = CustomerRow & {
  summary: CustomerSalesSummary;
};

export type CustomerActionState = {
  status: "idle" | "error";
  message: string | null;
};
