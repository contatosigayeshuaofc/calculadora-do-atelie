import Link from "next/link";
import { Edit3, Eye, UserRoundSearch } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import type { DashboardTopCustomer } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type TopCustomersProps = {
  currencyCode: string;
  customers: DashboardTopCustomer[];
};

export function TopCustomers({ currencyCode, customers }: TopCustomersProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)]">
      <h2 className="text-xl font-medium text-[color:var(--color-cream)]">
        Clientes destaque
      </h2>
      {customers.length === 0 ? (
        <EmptyState
          className="mt-3"
          description="Quando houver pedidos válidos, os melhores clientes do mês aparecem aqui."
          icon={<UserRoundSearch className="h-5 w-5" aria-hidden="true" />}
          title="Sem histórico no mês"
        />
      ) : (
        <ol className="mt-3 divide-y divide-[color:var(--color-card-border)]">
          {customers.map((customer, index) => (
            <li
              className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
              key={customer.customerId}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[color:var(--color-cream)]">
                  {index + 1}. {customer.customerName}
                </p>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  {customer.orderCount} pedido(s) · {formatCurrency(customer.totalCents, currencyCode)}
                </p>
              </div>
              <div className="flex gap-2 sm:justify-end">
                <Link href={`/clientes/${customer.customerId}` as never}>
                  <Button aria-label={`Visualizar cliente ${customer.customerName}`} leftIcon={<Eye className="h-4 w-4" />} size="icon" variant="secondary" />
                </Link>
                <Link href={`/clientes/${customer.customerId}/editar` as never}>
                  <Button aria-label={`Editar cliente ${customer.customerName}`} leftIcon={<Edit3 className="h-4 w-4" />} size="icon" variant="ghost" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
