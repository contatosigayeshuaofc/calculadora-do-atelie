"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { saveSaleAction } from "@/features/sales/actions";
import { calculateSaleTotals } from "@/features/sales/calculations";
import { orderStatuses, paymentStatuses } from "@/features/sales/schemas";
import {
  orderStatusLabels,
  paymentStatusLabels,
  type SaleCustomerOption,
  type SaleProductOption,
} from "@/features/sales/types";
import { formatCurrency } from "@/lib/currency/format-currency";
import { parseCurrencyInput } from "@/lib/currency/parse-currency-input";

type SaleFormProps = {
  customers: SaleCustomerOption[];
  products: SaleProductOption[];
};

type SaleItemDraft = {
  productId: string;
  quantity: string;
  unitPrice: string;
};

type SaleDraft = {
  customerId: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  discount: string;
  deliveryFee: string;
  notes: string;
};

const emptyItem: SaleItemDraft = {
  productId: "",
  quantity: "1",
  unitPrice: "",
};

export function SaleForm({ customers, products }: SaleFormProps) {
  const [state, action, isPending] = useActionState(saveSaleAction, {
    status: "idle" as const,
    message: null,
  });
  const [form, setForm] = useState<SaleDraft>({
    customerId: "",
    orderDate: new Date().toISOString().slice(0, 10),
    deliveryDate: "",
    status: "confirmed",
    paymentStatus: "unpaid",
    paymentMethod: "",
    discount: "",
    deliveryFee: "",
    notes: "",
  });
  const [items, setItems] = useState<SaleItemDraft[]>([{ ...emptyItem }]);
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const payload = useMemo(() => ({ ...form, items }), [form, items]);
  const calculation = useMemo(() => {
    try {
      const parsedItems = items.map((item) => {
        const product = productById.get(item.productId);

        if (!product) {
          throw new Error("Produto incompleto.");
        }

        return {
          productId: product.id,
          productName: product.name,
          saleUnit: product.sale_unit,
          quantity: Number(item.quantity),
          unitPriceCents: parseCurrencyInput(item.unitPrice),
          unitCostCents: product.unit_cost_cents,
          minimumPriceCents: product.minimum_price_cents,
          recommendedPriceCents: product.recommended_price_cents,
        };
      });

      return calculateSaleTotals({
        items: parsedItems,
        discountCents: parseCurrencyInput(form.discount),
        deliveryFeeCents: parseCurrencyInput(form.deliveryFee),
      });
    } catch {
      return null;
    }
  }, [form.discount, form.deliveryFee, items, productById]);

  function updateField(name: keyof SaleDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateItem(index: number, name: keyof SaleItemDraft, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: value } : item,
      ),
    );
  }

  function selectProduct(index: number, productId: string) {
    const product = productById.get(productId);

    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              productId,
              unitPrice: product
                ? formatCurrency(product.selling_price_cents)
                : item.unitPrice,
            }
          : item,
      ),
    );
  }

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <input name="payload" type="hidden" value={JSON.stringify(payload)} />
      <section className="space-y-5 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Nova venda
          </p>
          <h1 className="mt-1 font-black text-2xl text-[color:var(--color-cream)]">
            Registrar pedido
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Cliente"
            onChange={(event) => updateField("customerId", event.target.value)}
            value={form.customerId}
          >
            <option value="">Sem cliente vinculado</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
          <Input
            label="Data do pedido"
            onChange={(event) => updateField("orderDate", event.target.value)}
            type="date"
            value={form.orderDate}
          />
          <Input
            label="Data de entrega"
            onChange={(event) => updateField("deliveryDate", event.target.value)}
            type="date"
            value={form.deliveryDate}
          />
          <Select
            label="Status"
            onChange={(event) => updateField("status", event.target.value)}
            value={form.status}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {orderStatusLabels[status]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-[color:var(--color-cream)]">
            Produtos do pedido
          </p>
          {items.map((item, index) => (
            <div
              className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] p-3 md:grid-cols-[1fr_100px_150px_auto]"
              key={index}
            >
              <Select
                label="Produto"
                onChange={(event) => selectProduct(index, event.target.value)}
                value={item.productId}
              >
                <option value="">Selecione</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>
              <Input
                inputMode="numeric"
                label="Qtd"
                onChange={(event) => updateItem(index, "quantity", event.target.value)}
                value={item.quantity}
              />
              <Input
                inputMode="decimal"
                label="Preço unitário"
                onBlur={(event) =>
                  updateItem(
                    index,
                    "unitPrice",
                    formatCurrency(parseCurrencyInput(event.target.value)),
                  )
                }
                onChange={(event) => updateItem(index, "unitPrice", event.target.value)}
                value={item.unitPrice}
              />
              <div className="flex items-end">
                {items.length > 1 ? (
                  <Button
                    aria-label="Remover produto"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() =>
                      setItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    size="icon"
                    type="button"
                    variant="ghost"
                  />
                ) : null}
              </div>
            </div>
          ))}
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setItems((current) => [...current, { ...emptyItem }])}
            type="button"
            variant="secondary"
          >
            Adicionar produto
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            inputMode="decimal"
            label="Desconto"
            onBlur={(event) =>
              updateField("discount", formatCurrency(parseCurrencyInput(event.target.value)))
            }
            onChange={(event) => updateField("discount", event.target.value)}
            value={form.discount}
          />
          <Input
            inputMode="decimal"
            label="Taxa de entrega"
            onBlur={(event) =>
              updateField(
                "deliveryFee",
                formatCurrency(parseCurrencyInput(event.target.value)),
              )
            }
            onChange={(event) => updateField("deliveryFee", event.target.value)}
            value={form.deliveryFee}
          />
          <Select
            label="Pagamento"
            onChange={(event) => updateField("paymentStatus", event.target.value)}
            value={form.paymentStatus}
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {paymentStatusLabels[status]}
              </option>
            ))}
          </Select>
          <Input
            label="Forma de pagamento"
            onChange={(event) => updateField("paymentMethod", event.target.value)}
            value={form.paymentMethod}
          />
          <Textarea
            className="md:col-span-2"
            label="Observações"
            onChange={(event) => updateField("notes", event.target.value)}
            value={form.notes}
          />
        </div>

        {state.message ? (
          <p className="rounded-[var(--radius-sm)] bg-[rgba(160,82,70,0.12)] px-3 py-2 text-sm font-semibold text-[color:var(--color-danger)]">
            {state.message}
          </p>
        ) : null}

        <Button
          disabled={products.length === 0}
          isLoading={isPending}
          leftIcon={<Save className="h-4 w-4" />}
          type="submit"
        >
          Salvar pedido
        </Button>
      </section>

      <aside className="h-fit rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
          Resumo
        </p>
        {calculation ? (
          <div className="mt-3 space-y-3 text-sm">
            <Row label="Subtotal" value={formatCurrency(calculation.subtotalCents)} />
            <Row label="Desconto" value={formatCurrency(calculation.discountCents)} />
            <Row label="Entrega" value={formatCurrency(calculation.deliveryFeeCents)} />
            <Row label="Total" value={formatCurrency(calculation.totalCents)} strong />
            <Row
              label="Lucro estimado"
              value={formatCurrency(calculation.estimatedProfitCents)}
              strong
            />
          </div>
        ) : (
          <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
            Selecione os produtos para ver total e lucro.
          </p>
        )}
      </aside>
    </form>
  );
}

function Row({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[color:var(--color-text-muted)]">{label}</span>
      <span
        className={
          strong
            ? "text-base font-bold text-[color:var(--color-cream)]"
            : "font-semibold text-[color:var(--color-cream)]"
        }
      >
        {value}
      </span>
    </div>
  );
}
