import Link from "next/link";
import { Eye, ReceiptText } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sales/sale-status";
import type { DashboardSaleInput } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type RecentSalesProps = {
  sales: DashboardSaleInput[];
};

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
      <h2 className="text-2xl font-black text-[color:var(--color-cream)]">
        Vendas recentes
      </h2>
      {sales.length === 0 ? (
        <EmptyState
          className="mt-4"
          description="Registre uma venda para acompanhar faturamento, lucro e entrega por aqui."
          icon={<ReceiptText className="h-5 w-5" aria-hidden="true" />}
          title="Nenhuma venda neste mês"
        />
      ) : (
        <div className="mt-4 grid gap-3">
          {sales.map((sale) => (
            <article
              className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[rgba(24,21,18,0.34)] p-3 sm:grid-cols-[1fr_auto]"
              key={sale.id}
            >
              <div>
                <p className="font-semibold text-[color:var(--color-cream)]">
                  {sale.customerName ?? "Cliente não informado"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <OrderStatusBadge status={sale.status} />
                  <PaymentStatusBadge status={sale.paymentStatus} />
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                  {formatDate(sale.orderDate)} - {formatCurrency(sale.totalCents)}
                </p>
              </div>
              {sale.id ? (
                <Link href={`/vendas/${sale.id}` as never}>
                  <Button
                    aria-label="Ver venda"
                    leftIcon={<Eye className="h-4 w-4" />}
                    size="icon"
                    variant="secondary"
                  />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
