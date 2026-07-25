import Link from "next/link";
import { Edit3, Eye, Plus, Search, Users } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import type { CustomerListItem } from "@/features/customers/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type CustomerListProps = {
  customers: CustomerListItem[];
  search?: string;
};

export function CustomerList({ customers, search = "" }: CustomerListProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Clientes
          </p>
          <h1 className="mt-1 font-medium text-3xl text-[color:var(--color-cream)]">
            Relacionamento e histórico
          </h1>
        </div>
        <Link href="/clientes/novo">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nova cliente
          </Button>
        </Link>
      </div>

      <form className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)] md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
          <input
            className="atelier-field h-11 w-full rounded-[var(--radius-sm)] pl-9 pr-3 text-sm"
            defaultValue={search}
            name="busca"
            placeholder="Buscar por nome, cidade ou Instagram"
          />
        </label>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {customers.length === 0 ? (
        <EmptyState
          action={
            <Link href="/clientes/novo">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Cadastrar cliente
              </Button>
            </Link>
          }
          description="Cadastre suas clientes para acompanhar histórico, preferência e recorrência de compra."
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          title="Nenhuma cliente encontrada"
        />
      ) : (
        <div className="grid gap-3">
          {customers.map((customer) => (
            <article
              className="grid gap-4 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] md:grid-cols-[1fr_auto]"
              key={customer.id}
            >
              <div>
                <h2 className="font-medium text-xl text-[color:var(--color-cream)]">
                  {customer.name}
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {[customer.city, customer.instagram].filter(Boolean).join(" · ") ||
                    "Sem contato complementar"}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <Metric label="Pedidos" value={String(customer.summary.orderCount)} />
                  <Metric
                    label="Total comprado"
                    value={formatCurrency(customer.summary.totalSpentCents)}
                  />
                  <Metric
                    label="Última compra"
                    value={formatDate(customer.summary.lastOrderDate)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <Link href={`/clientes/${customer.id}` as never}>
                  <Button
                    aria-label="Ver cliente"
                    leftIcon={<Eye className="h-4 w-4" />}
                    size="icon"
                    variant="secondary"
                  />
                </Link>
                <Link href={`/clientes/${customer.id}/editar` as never}>
                  <Button
                    aria-label="Editar cliente"
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
      <p className="font-semibold text-[color:var(--color-cream)]">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sem vendas";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
