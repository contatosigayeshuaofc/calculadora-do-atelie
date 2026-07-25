"use client";

import { useActionState, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { updateSaleAction } from "@/features/sales/actions";
import { orderStatuses, paymentStatuses } from "@/features/sales/schemas";
import {
  orderStatusLabels,
  paymentMethodOptions,
  paymentStatusLabels,
  type SaleDetail,
} from "@/features/sales/types";

export function SaleEditForm({ sale }: { sale: SaleDetail }) {
  const [state, action, isPending] = useActionState(updateSaleAction, {
    status: "idle" as const,
    message: null,
  });
  const [form, setForm] = useState({
    saleId: sale.id,
    orderDate: sale.order_date,
    deliveryDate: sale.delivery_date ?? "",
    status: sale.status,
    paymentStatus: sale.payment_status,
    paymentMethod: sale.payment_method ?? "",
    notes: sale.notes ?? "",
  });
  const payload = useMemo(() => form, [form]);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form action={action} className="max-w-3xl space-y-5 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
      <input name="payload" type="hidden" value={JSON.stringify(payload)} />
      <div>
        <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
          Pedido #{sale.id.slice(0, 8)}
        </p>
        <h1 className="mt-1 font-medium text-2xl text-[color:var(--color-cream)]">
          Editar acompanhamento
        </h1>
      </div>
      {sale.status === "delivered" ? (
        <p className="rounded-[var(--radius-sm)] bg-[color:var(--color-soft-cream)] px-3 py-2 text-sm text-[color:var(--color-text-muted)]">
          Pedido entregue: os itens ficam preservados. Aqui você altera apenas acompanhamento, pagamento, datas e observacoes.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
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
        <Select
          label="Forma de pagamento"
          onChange={(event) => updateField("paymentMethod", event.target.value)}
          value={form.paymentMethod}
        >
          <option value="">Selecione a forma</option>
          <optgroup label="Formas de pagamento">
            {paymentMethodOptions.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </optgroup>
        </Select>
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
      <Button isLoading={isPending} leftIcon={<Save className="h-4 w-4" />} type="submit">
        Salvar acompanhamento
      </Button>
    </form>
  );
}
