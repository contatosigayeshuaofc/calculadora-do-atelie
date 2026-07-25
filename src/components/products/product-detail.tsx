import Link from "next/link";
import { Archive, Edit3, RotateCcw } from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";
import {
  archiveProductAction,
  restoreProductAction,
} from "@/features/products/actions";
import type { ProductDetail as ProductDetailType } from "@/features/products/types";
import { formatCurrency } from "@/lib/currency/format-currency";

type ProductDetailProps = {
  product: ProductDetailType;
};

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            className="text-sm font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
            href="/produtos"
          >
            Voltar para produtos
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-medium text-[color:var(--color-cream)]">
              {product.name}
            </h1>
            <StatusBadge tone={product.is_active ? "success" : "neutral"}>
              {product.is_active ? "Ativo" : "Arquivado"}
            </StatusBadge>
          </div>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {product.category || "Sem categoria"} · {product.sale_unit}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/produtos/${product.id}/editar` as never}>
            <Button leftIcon={<Edit3 className="h-4 w-4" />} variant="secondary">
              Editar
            </Button>
          </Link>
          <form
            action={
              product.is_active ? archiveProductAction : restoreProductAction
            }
          >
            <input name="productId" type="hidden" value={product.id} />
            <Button
              leftIcon={
                product.is_active ? (
                  <Archive className="h-4 w-4" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )
              }
              type="submit"
              variant={product.is_active ? "danger" : "secondary"}
            >
              {product.is_active ? "Arquivar" : "Restaurar"}
            </Button>
          </form>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="Custo unitário" value={product.unit_cost_cents} />
        <Metric label="Preço mínimo" value={product.minimum_price_cents} />
        <Metric label="Recomendado" value={product.recommended_price_cents} />
        <Metric label="Praticado" value={product.selling_price_cents} />
      </section>

      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
        <h2 className="text-2xl font-medium text-[color:var(--color-cream)]">
          Custos do lote
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-xs uppercase text-[color:var(--color-text-muted)]">
              <tr className="border-b border-[color:var(--color-card-border)]">
                <th className="py-2">Item</th>
                <th className="py-2">Compra</th>
                <th className="py-2">Uso</th>
                <th className="py-2 text-right">Custo usado</th>
              </tr>
            </thead>
            <tbody>
              {product.product_cost_items.map((item) => (
                <tr
                  className="border-b border-[color:var(--color-card-border)] last:border-0"
                  key={item.id}
                >
                  <td className="py-3 font-semibold text-[color:var(--color-cream)]">
                    {item.name}
                  </td>
                  <td className="py-3 text-[color:var(--color-text-muted)]">
                    {Number(item.purchase_quantity)} {item.unit_measure} por{" "}
                    {formatCurrency(item.purchase_price_cents)}
                  </td>
                  <td className="py-3 text-[color:var(--color-text-muted)]">
                    {Number(item.used_quantity)} {item.unit_measure}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    {formatCurrency(item.calculated_cost_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[color:var(--color-cream)]">
        {formatCurrency(value)}
      </p>
    </div>
  );
}
