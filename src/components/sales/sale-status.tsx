import { StatusBadge } from "@/components/ui";
import type { OrderStatus, PaymentStatus } from "@/types/database";
import { orderStatusLabels, paymentStatusLabels } from "@/features/sales/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === "delivered"
      ? "success"
      : status === "canceled"
        ? "danger"
        : status === "quote"
          ? "neutral"
          : "warning";

  return <StatusBadge tone={tone}>{orderStatusLabels[status]}</StatusBadge>;
}

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const tone =
    status === "paid"
      ? "success"
      : status === "partially_paid"
        ? "warning"
        : "neutral";

  return <StatusBadge tone={tone}>{paymentStatusLabels[status]}</StatusBadge>;
}
