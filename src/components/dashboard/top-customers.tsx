import { UserRoundSearch } from "lucide-react";
import { EmptyState } from "@/components/ui";
import type { DashboardTopCustomer } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type TopCustomersProps = {
  customers: DashboardTopCustomer[];
};

export function TopCustomers({ customers }: TopCustomersProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <h2 className="font-serif text-2xl text-[color:var(--color-warm-graphite)]">
        Clientes destaque
      </h2>
      {customers.length === 0 ? (
        <EmptyState
          className="mt-4"
          description="Quando houver pedidos validos, os melhores clientes do mes aparecem aqui."
          icon={<UserRoundSearch className="h-5 w-5" aria-hidden="true" />}
          title="Sem historico no mes"
        />
      ) : (
        <ol className="mt-4 space-y-3">
          {customers.map((customer, index) => (
            <li
              className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[rgba(248,246,241,0.58)] p-3"
              key={customer.customerId}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[color:var(--color-warm-graphite)]">
                  {index + 1}. {customer.customerName}
                </p>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  {customer.orderCount} pedido(s)
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[color:var(--color-olive)]">
                {formatCurrency(customer.totalCents)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
