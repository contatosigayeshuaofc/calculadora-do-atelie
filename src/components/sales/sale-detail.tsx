import Link from "next/link";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui";
import type { SaleDetail as SaleDetailType } from "@/features/sales/types";
import { formatCurrency } from "@/lib/currency/format-currency";
import { OrderStatusBadge, PaymentStatusBadge } from "./sale-status";

export function SaleDetail({ sale }: { sale: SaleDetailType }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Pedido #{sale.id.slice(0, 8)}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-[color:var(--color-warm-graphite)]">
            {sale.customer?.name ?? "Cliente nao informado"}
          </h1>
        </div>
        <Link href={`/vendas/${sale.id}/editar` as never}>
          <Button leftIcon={<Edit3 className="h-4 w-4" />} variant="secondary">
            Editar acompanhamento
          </Button>
        </Link>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="Total" value={formatCurrency(sale.total_cents)} />
        <Metric label="Custo estimado" value={formatCurrency(sale.estimated_cost_cents)} />
        <Metric label="Lucro estimado" value={formatCurrency(sale.estimated_profit_cents)} />
        <Metric label="Itens" value={String(sale.sale_items.length)} />
      </section>

      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={sale.status} />
          <PaymentStatusBadge status={sale.payment_status} />
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
          <Info label="Data do pedido" value={formatDate(sale.order_date)} />
          <Info label="Entrega" value={formatDate(sale.delivery_date)} />
          <Info label="Pagamento" value={sale.payment_method ?? "Nao informado"} />
          <Info label="Desconto" value={formatCurrency(sale.discount_cents)} />
        </div>
      </section>

      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
        <h2 className="font-serif text-2xl text-[color:var(--color-warm-graphite)]">
          Produtos vendidos
        </h2>
        <div className="mt-4 divide-y divide-[color:var(--color-clay-beige)]">
          {sale.sale_items.map((item) => (
            <div className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_110px_130px_130px]" key={item.id}>
              <div>
                <p className="font-semibold text-[color:var(--color-warm-graphite)]">
                  {item.product_name_snapshot}
                </p>
                <p className="text-xs text-[color:var(--color-text-muted)]">
                  {item.quantity} {item.sale_unit_snapshot}
                </p>
              </div>
              <Info label="Unitario" value={formatCurrency(item.unit_price_cents)} />
              <Info label="Subtotal" value={formatCurrency(item.subtotal_cents)} />
              <Info label="Lucro" value={formatCurrency(item.estimated_profit_cents)} />
            </div>
          ))}
        </div>
      </section>

      {sale.notes ? (
        <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-soft)]">
          {sale.notes}
        </section>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[color:var(--color-warm-graphite)]">
        {value}
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="font-semibold text-[color:var(--color-warm-graphite)]">
        {value}
      </p>
    </div>
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
