import Link from "next/link";
import { Edit3, Eye, Plus, Search, ShoppingBag } from "lucide-react";
import { Button, EmptyState, Select } from "@/components/ui";
import type { SaleListItem } from "@/features/sales/types";
import {
  orderStatusLabels,
  paymentStatusLabels,
} from "@/features/sales/types";
import { orderStatuses, paymentStatuses } from "@/features/sales/schemas";
import { formatCurrency } from "@/lib/currency/format-currency";
import { OrderStatusBadge, PaymentStatusBadge } from "./sale-status";

type SaleListProps = {
  sales: SaleListItem[];
  search?: string;
  status?: string;
  paymentStatus?: string;
};

export function SaleList({
  paymentStatus = "",
  sales,
  search = "",
  status = "",
}: SaleListProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Vendas
          </p>
          <h1 className="mt-1 font-medium text-3xl text-[color:var(--color-cream)]">
            Pedidos do ateliê
          </h1>
        </div>
        <Link href="/vendas/nova">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Registrar venda
          </Button>
        </Link>
      </div>

      <form className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)] lg:grid-cols-[1fr_190px_190px_auto]">
        <label className="relative block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
          <input
            className="atelier-field h-11 w-full rounded-[var(--radius-sm)] pl-9 pr-3 text-sm"
            defaultValue={search}
            name="busca"
            placeholder="Buscar por cliente ou código"
          />
        </label>
        <Select defaultValue={status} name="status">
          <option value="">Todos os pedidos</option>
          {orderStatuses.map((item) => (
            <option key={item} value={item}>
              {orderStatusLabels[item]}
            </option>
          ))}
        </Select>
        <Select defaultValue={paymentStatus} name="pagamento">
          <option value="">Todos os pagamentos</option>
          {paymentStatuses.map((item) => (
            <option key={item} value={item}>
              {paymentStatusLabels[item]}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {sales.length === 0 ? (
        <EmptyState
          action={
            <Link href="/vendas/nova">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Registrar venda
              </Button>
            </Link>
          }
          description="Quando surgir um pedido, selecione o cliente, os produtos e a data de entrega."
          icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
          title="Nenhuma venda registrada"
        />
      ) : (
        <div className="grid gap-3">
          {sales.map((sale) => (
            <article
              className="grid gap-4 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] lg:grid-cols-[1fr_auto]"
              key={sale.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium text-xl text-[color:var(--color-cream)]">
                    Pedido #{sale.id.slice(0, 8)}
                  </h2>
                  <OrderStatusBadge status={sale.status} />
                  <PaymentStatusBadge status={sale.payment_status} />
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {sale.customer_name ?? "Cliente não informado"} - {sale.item_count} item(ns)
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <Metric label="Pedido" value={formatDate(sale.order_date)} />
                  <Metric label="Entrega" value={formatDate(sale.delivery_date)} />
                  <Metric label="Total" value={formatCurrency(sale.total_cents)} />
                  <Metric
                    label="Lucro estimado"
                    value={formatCurrency(sale.estimated_profit_cents)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 lg:justify-end">
                <Link href={`/vendas/${sale.id}` as never}>
                  <Button
                    aria-label="Ver venda"
                    leftIcon={<Eye className="h-4 w-4" />}
                    size="icon"
                    variant="secondary"
                  />
                </Link>
                <Link href={`/vendas/${sale.id}/editar` as never}>
                  <Button
                    aria-label="Editar venda"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    size="icon"
                    variant="ghost"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="font-medium text-[color:var(--color-cream)]">
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
