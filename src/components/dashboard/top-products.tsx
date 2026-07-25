import Link from "next/link";
import { Edit3, Eye, PackageSearch } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import type { DashboardTopProduct } from "@/features/dashboard/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type TopProductsProps = {
  products: DashboardTopProduct[];
};

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)]">
      <h2 className="text-xl font-medium text-[color:var(--color-cream)]">
        Produtos mais vendidos
      </h2>
      {products.length === 0 ? (
        <EmptyState
          className="mt-3"
          description="Os produtos campeões aparecem depois das primeiras vendas válidas."
          icon={<PackageSearch className="h-5 w-5" aria-hidden="true" />}
          title="Sem ranking ainda"
        />
      ) : (
        <ol className="mt-3 divide-y divide-[color:var(--color-card-border)]">
          {products.map((product, index) => (
            <li
              className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
              key={product.productId}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[color:var(--color-cream)]">
                  {index + 1}. {product.productName}
                </p>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  {product.quantity} unidade(s) · {formatCurrency(product.totalCents)}
                </p>
              </div>
              <div className="flex gap-2 sm:justify-end">
                <Link href={`/produtos/${product.productId}` as never}>
                  <Button
                    aria-label={`Visualizar produto ${product.productName}`}
                    leftIcon={<Eye className="h-4 w-4" />}
                    size="icon"
                    variant="secondary"
                  />
                </Link>
                <Link href={`/produtos/${product.productId}/editar` as never}>
                  <Button
                    aria-label={`Editar produto ${product.productName}`}
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    size="icon"
                    variant="ghost"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
