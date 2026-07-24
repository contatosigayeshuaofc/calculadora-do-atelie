import {
  Banknote,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/currency/format-currency";
import type { DashboardSummary } from "@/features/dashboard/types";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      icon: CircleDollarSign,
      label: "Faturamento",
      value: formatCurrency(summary.revenueCents),
    },
    {
      icon: TrendingUp,
      label: "Lucro estimado",
      value: formatCurrency(summary.estimatedProfitCents),
    },
    {
      icon: ReceiptText,
      label: "Pedidos",
      value: String(summary.orderCount),
    },
    {
      icon: Banknote,
      label: "Ticket medio",
      value: formatCurrency(summary.averageTicketCents),
    },
    {
      icon: Clock3,
      label: "Valores pendentes",
      value: formatCurrency(summary.pendingAmountCents),
    },
    {
      icon: PackageCheck,
      label: "Em andamento",
      value: String(summary.activeOrderCount),
    },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[color:var(--color-text-muted)]">
                {card.label}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(104,98,70,0.1)] text-[color:var(--color-olive)]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 font-serif text-3xl leading-none text-[color:var(--color-warm-graphite)]">
              {card.value}
            </p>
          </article>
        );
      })}
      {summary.pendingAmountIsApproximate ? (
        <div className="md:col-span-2 xl:col-span-3">
          <StatusBadge tone="warning">
            Pendentes incluem o total dos pagamentos parciais no MVP
          </StatusBadge>
        </div>
      ) : null}
    </section>
  );
}
