import Link from "next/link";
import { Edit3 } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import type { CustomerDetail as CustomerDetailType } from "@/features/customers/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type CustomerDetailProps = {
  customer: CustomerDetailType;
};

export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            className="text-sm font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
            href="/clientes"
          >
            Voltar para clientes
          </Link>
          <h1 className="mt-3 text-3xl font-medium text-[color:var(--color-cream)]">
            {customer.name}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {[customer.city, customer.instagram].filter(Boolean).join(" · ") ||
              "Cliente cadastrada sem cidade ou Instagram"}
          </p>
        </div>
        <Link href={`/clientes/${customer.id}/editar` as never}>
          <Button leftIcon={<Edit3 className="h-4 w-4" />} variant="secondary">
            Editar
          </Button>
        </Link>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <Metric label="Pedidos" value={String(customer.summary.orderCount)} />
        <Metric
          label="Total comprado"
          value={formatCurrency(customer.summary.totalSpentCents)}
        />
        <Metric
          label="Última compra"
          value={formatDate(customer.summary.lastOrderDate)}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <InfoCard label="WhatsApp" value={customer.whatsapp} />
        <InfoCard label="Instagram" value={customer.instagram} />
        <InfoCard label="Cidade" value={customer.city} />
        <InfoCard label="Aniversário" value={formatDate(customer.birthday)} />
      </section>

      {customer.notes ? (
        <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
          <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Observações
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-cream)]">
            {customer.notes}
          </p>
        </section>
      ) : null}

      {customer.summary.orderCount === 0 ? (
        <EmptyState
          description="Quando as vendas forem registradas, o histórico desta cliente aparecerá aqui."
          title="Sem vendas registradas"
        />
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[color:var(--color-cream)]">
        {value}
      </p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
      <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--color-cream)]">
        {value || "Não informado"}
      </p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sem registro";
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
