import { StatusBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/currency/format-currency";
import type { DashboardSummary } from "@/features/dashboard/types";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      icon: "💰",
      label: "Faturamento",
      value: formatCurrency(summary.revenueCents),
    },
    {
      icon: "✨",
      label: "Lucro líquido",
      value: formatCurrency(summary.estimatedProfitCents),
    },
    {
      icon: "📦",
      label: "Peças vendidas",
      value: String(summary.itemQuantity),
    },
    {
      icon: "🤍",
      label: "Clientes",
      value: String(summary.customerCount),
    },
    {
      icon: "🧾",
      label: "Vendas",
      value: String(summary.orderCount),
    },
    {
      icon: "🏷️",
      label: "Ticket médio",
      value: formatCurrency(summary.averageTicketCents),
    },
    {
      icon: "⏳",
      label: "Pagamentos pendentes",
      value: formatCurrency(summary.pendingAmountCents),
    },
    {
      icon: "🌿",
      label: "Em andamento",
      value: String(summary.activeOrderCount),
    },
  ];

  return (
    <section aria-label="Resumo do mês" className="atelier-floating-card grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        return (
          <article
            className="rounded-[var(--radius-md)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-normal uppercase text-[color:var(--color-text-muted)]">
                {card.label}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.18)] text-lg">
                <span aria-hidden="true">{card.icon}</span>
              </span>
            </div>
            <p className="mt-4 text-3xl font-medium leading-none text-[color:var(--color-cream)]">
              {card.value}
            </p>
          </article>
        );
      })}
      {summary.pendingAmountIsApproximate ? (
        <div className="md:col-span-2 xl:col-span-4">
          <StatusBadge tone="warning">
            Pendentes incluem o total dos pagamentos parciais no MVP
          </StatusBadge>
        </div>
      ) : null}
    </section>
  );
}
