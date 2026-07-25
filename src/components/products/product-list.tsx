import Link from "next/link";
import { Archive, Edit3, Eye, Plus, Search } from "lucide-react";
import { Button, EmptyState, StatusBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/currency/format-currency";
import type { ProductListItem } from "@/features/products/types";

type ProductListProps = {
  products: ProductListItem[];
  search?: string;
  includeArchived?: boolean;
};

export function ProductList({
  includeArchived = false,
  products,
  search = "",
}: ProductListProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Produtos
          </p>
          <h1 className="mt-1 font-black text-3xl text-[color:var(--color-cream)]">
            Catálogo precificado
          </h1>
        </div>
        <Link href="/produtos/novo">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Novo produto
          </Button>
        </Link>
      </div>

      <form className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)] md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
          <input
            className="atelier-field h-11 w-full rounded-[var(--radius-sm)] pl-9 pr-3 text-sm"
            defaultValue={search}
            name="busca"
            placeholder="Buscar por nome ou categoria"
          />
        </label>
        <label className="flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] px-3 text-sm font-semibold text-[color:var(--color-cream)]">
          <input
            defaultChecked={includeArchived}
            name="arquivados"
            type="checkbox"
            value="1"
          />
          Arquivados
        </label>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {products.length === 0 ? (
        <EmptyState
          action={
            <Link href="/produtos/novo">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Cadastrar produto
              </Button>
            </Link>
          }
          description="Cadastre sua primeira peça para calcular custo, preço mínimo e preço recomendado."
          icon={<Archive className="h-5 w-5" aria-hidden="true" />}
          title="Nenhum produto encontrado"
        />
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <article
              className="grid gap-4 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] md:grid-cols-[1fr_auto]"
              key={product.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-xl text-[color:var(--color-cream)]">
                    {product.name}
                  </h2>
                  <StatusBadge tone={product.is_active ? "success" : "neutral"}>
                    {product.is_active ? "Ativo" : "Arquivado"}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {product.category || "Sem categoria"} · {product.sale_unit}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <Metric label="Custo" value={product.unit_cost_cents} />
                  <Metric label="Mínimo" value={product.minimum_price_cents} />
                  <Metric
                    label="Recomendado"
                    value={product.recommended_price_cents}
                  />
                  <Metric label="Praticado" value={product.selling_price_cents} />
                </div>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <Link href={`/produtos/${product.id}` as never}>
                  <Button
                    aria-label="Ver produto"
                    leftIcon={<Eye className="h-4 w-4" />}
                    size="icon"
                    variant="secondary"
                  />
                </Link>
                <Link href={`/produtos/${product.id}/editar` as never}>
                  <Button
                    aria-label="Editar produto"
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--color-text-muted)]">{label}</p>
      <p className="font-semibold text-[color:var(--color-cream)]">
        {formatCurrency(value)}
      </p>
    </div>
  );
}
