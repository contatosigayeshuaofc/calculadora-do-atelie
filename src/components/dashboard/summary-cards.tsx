import { StatusBadge } from "@/components/ui";
import type { DashboardSummary } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

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
    <section aria-label="Resumo do mês" className="atelier-floating-card">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        {cards.map((card) => {
          return (
            <article
              className="min-h-28 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)]"
              key={card.label}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.16)] text-base"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
              </div>
              <p className="mt-3 text-[11px] font-normal uppercase leading-4 text-[color:var(--color-text-muted)]">
                {card.label}
              </p>
              <p className="mt-1 break-words text-xl font-medium leading-6 text-[color:var(--color-cream)]">
                {card.value}
              </p>
            </article>
          );
        })}
      </div>
      {summary.pendingAmountIsApproximate ? (
        <div className="mt-3">
          <StatusBadge tone="warning">
            Pendentes incluem o total dos pagamentos parciais no MVP
          </StatusBadge>
        </div>
      ) : null}
    </section>
  );
}
