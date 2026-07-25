import Link from "next/link";
import { CalendarClock, Edit3, Eye } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { OrderStatusBadge } from "@/components/sales/sale-status";
import type { DashboardSaleInput } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type UpcomingDeliveriesProps = {
  deliveries: DashboardSaleInput[];
};

export function UpcomingDeliveries({ deliveries }: UpcomingDeliveriesProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)]">
      <h2 className="text-xl font-medium text-[color:var(--color-cream)]">
        Próximas entregas
      </h2>
      {deliveries.length === 0 ? (
        <EmptyState
          className="mt-3"
          description="Nenhuma entrega marcada para os próximos sete dias."
          icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
          title="Agenda tranquila"
        />
      ) : (
        <div className="mt-3 divide-y divide-[color:var(--color-card-border)]">
          {deliveries.map((sale) => (
            <article
              className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
              key={sale.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-[color:var(--color-cream)]">
                    {sale.customerName ?? "Cliente não informado"}
                  </p>
                  <OrderStatusBadge status={sale.status} />
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {formatDate(sale.deliveryDate)} · {formatCurrency(sale.totalCents)}
                </p>
              </div>
              {sale.id ? (
                <div className="flex gap-2 sm:justify-end">
                  <Link href={`/vendas/${sale.id}` as never}>
                    <Button
                      aria-label="Visualizar entrega"
                      leftIcon={<Eye className="h-4 w-4" />}
                      size="icon"
                      variant="secondary"
                    />
                  </Link>
                  <Link href={`/vendas/${sale.id}/editar` as never}>
                    <Button
                      aria-label="Editar entrega"
                      leftIcon={<Edit3 className="h-4 w-4" />}
                      size="icon"
                      variant="ghost"
                    />
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
