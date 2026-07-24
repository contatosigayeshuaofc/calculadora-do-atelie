import Link from "next/link";
import { CalendarClock, Eye } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import type { DashboardSaleInput } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";
import { OrderStatusBadge } from "@/components/sales/sale-status";

type UpcomingDeliveriesProps = {
  deliveries: DashboardSaleInput[];
};

export function UpcomingDeliveries({ deliveries }: UpcomingDeliveriesProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <h2 className="font-serif text-2xl text-[color:var(--color-warm-graphite)]">
        Proximas entregas
      </h2>
      {deliveries.length === 0 ? (
        <EmptyState
          className="mt-4"
          description="Nenhuma entrega marcada para os proximos sete dias."
          icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
          title="Agenda tranquila"
        />
      ) : (
        <div className="mt-4 grid gap-3">
          {deliveries.map((sale) => (
            <article
              className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-[rgba(248,246,241,0.56)] p-3 sm:grid-cols-[1fr_auto]"
              key={sale.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[color:var(--color-warm-graphite)]">
                    {sale.customerName ?? "Cliente nao informado"}
                  </p>
                  <OrderStatusBadge status={sale.status} />
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  Entrega {formatDate(sale.deliveryDate)} - {formatCurrency(sale.totalCents)}
                </p>
              </div>
              {sale.id ? (
                <Link href={`/vendas/${sale.id}` as never}>
                  <Button
                    aria-label="Ver entrega"
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

function formatDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
