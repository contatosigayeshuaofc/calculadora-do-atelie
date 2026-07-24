import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/ui";
import type { DashboardTopProduct } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type TopProductsProps = {
  products: DashboardTopProduct[];
};

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <h2 className="font-serif text-2xl text-[color:var(--color-warm-graphite)]">
        Mais vendidos
      </h2>
      {products.length === 0 ? (
        <EmptyState
          className="mt-4"
          description="Os produtos campeoes aparecem depois das primeiras vendas validas."
          icon={<PackageSearch className="h-5 w-5" aria-hidden="true" />}
          title="Sem ranking ainda"
        />
      ) : (
        <ol className="mt-4 space-y-3">
          {products.map((product, index) => (
            <li
              className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[rgba(248,246,241,0.58)] p-3"
              key={product.productId}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[color:var(--color-warm-graphite)]">
                  {index + 1}. {product.productName}
                </p>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  {product.quantity} unidade(s)
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[color:var(--color-olive)]">
                {formatCurrency(product.totalCents)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
