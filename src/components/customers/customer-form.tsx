"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { saveCustomerAction } from "@/features/customers/actions";
import type { CustomerRow } from "@/features/customers/types";

type CustomerFormProps = {
  customer?: CustomerRow | null;
};

type CustomerFormDraft = {
  customerId: string;
  name: string;
  whatsapp: string;
  instagram: string;
  city: string;
  birthday: string;
  notes: string;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const [state, action, isPending] = useActionState(saveCustomerAction, {
    status: "idle" as const,
    message: null,
  });
  const [form, setForm] = useState<CustomerFormDraft>(() =>
    customerToForm(customer),
  );
  const payload = useMemo(
    () => ({ ...form, customerId: customer?.id ?? "" }),
    [customer?.id, form],
  );

  function updateField(name: keyof CustomerFormDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-5">
      <input name="payload" type="hidden" value={JSON.stringify(payload)} />
      <div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
          href="/clientes"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para clientes
        </Link>
        <h1 className="mt-3 text-3xl font-black text-[color:var(--color-cream)]">
          {customer ? "Editar cliente" : "Nova cliente"}
        </h1>
      </div>

      <section className="grid gap-4 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5 md:grid-cols-2">
        <Input
          className="md:col-span-2"
          label="Nome da cliente"
          onChange={(event) => updateField("name", event.target.value)}
          value={form.name}
        />
        <Input
          hint="Opcional. Fica salvo como contato da cliente, sem abrir conversa automaticamente."
          inputMode="tel"
          label="WhatsApp"
          onChange={(event) => updateField("whatsapp", event.target.value)}
          value={form.whatsapp}
        />
        <Input
          hint="Use @usuário, se tiver."
          label="Instagram"
          onChange={(event) => updateField("instagram", event.target.value)}
          value={form.instagram}
        />
        <Input
          label="Cidade"
          onChange={(event) => updateField("city", event.target.value)}
          value={form.city}
        />
        <Input
          label="Aniversário"
          onChange={(event) => updateField("birthday", event.target.value)}
          type="date"
          value={form.birthday}
        />
        <Textarea
          className="md:col-span-2"
          hint="Preferências, medidas, combinados ou cuidados especiais."
          label="Observações"
          onChange={(event) => updateField("notes", event.target.value)}
          value={form.notes}
        />
      </section>

      {state.message ? (
        <p className="rounded-[var(--radius-sm)] bg-[rgba(160,82,70,0.12)] px-3 py-2 text-sm font-semibold text-[color:var(--color-danger)]">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          isLoading={isPending}
          leftIcon={<Save className="h-4 w-4" />}
          type="submit"
        >
          Salvar cliente
        </Button>
      </div>
    </form>
  );
}

function customerToForm(customer: CustomerRow | null | undefined): CustomerFormDraft {
  return {
    customerId: customer?.id ?? "",
    name: customer?.name ?? "",
    whatsapp: customer?.whatsapp ?? "",
    instagram: customer?.instagram ?? "",
    city: customer?.city ?? "",
    birthday: customer?.birthday ?? "",
    notes: customer?.notes ?? "",
  };
}
