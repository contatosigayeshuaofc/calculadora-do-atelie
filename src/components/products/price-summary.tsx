import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency/format-currency";
import { cn } from "@/lib/cn";
import type { ProductPricingResult } from "@/features/pricing/types";

type PriceSummaryProps = {
  result: ProductPricingResult;
};

export function PriceSummary({ result }: PriceSummaryProps) {
  const warning = result.isBelowMinimumPrice;

  return (
    <aside className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Resumo
          </p>
          <h2 className="mt-1 text-2xl font-black text-[color:var(--color-cream)]">
            Preço sugerido
          </h2>
        </div>
        {warning ? (
          <AlertTriangle
            aria-hidden="true"
            className="h-5 w-5 text-[color:var(--color-danger)]"
          />
        ) : (
          <CheckCircle2
            aria-hidden="true"
            className="h-5 w-5 text-[color:var(--color-success)]"
          />
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <SummaryItem label="Custo unitário" value={result.unitCostCents} />
        <SummaryItem label="Preço mínimo" value={result.minimumPriceCents} />
        <SummaryItem
          label="Recomendado"
          value={result.recommendedPriceCents}
        />
        <SummaryItem label="Lucro estimado" value={result.estimatedProfitCents} />
      </dl>

      <div
        className={cn(
          "mt-4 rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold",
          warning
            ? "bg-[rgba(160,82,70,0.12)] text-[color:var(--color-danger)]"
            : "bg-[rgba(93,124,91,0.14)] text-[color:var(--color-success)]",
        )}
      >
        {warning
          ? "O preço praticado está abaixo do mínimo calculado."
          : "O preço praticado cobre o mínimo calculado."}
      </div>
    </aside>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.12)] p-3">
      <dt className="text-xs text-[color:var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 font-semibold text-[color:var(--color-cream)]">
        {formatCurrency(value)}
      </dd>
    </div>
  );
}
