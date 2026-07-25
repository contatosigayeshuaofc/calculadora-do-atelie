"use client";

import { useActionState } from "react";
import { LifeBuoy, Save } from "lucide-react";
import { saveSettingsAction } from "@/features/settings/actions";
import type { AtelierSettings } from "@/features/settings/types";
import { Button, Input } from "@/components/ui";

type SettingsFormProps = {
  settings: AtelierSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, action, isPending] = useActionState(saveSettingsAction, {
    message: null,
    status: "idle" as const,
  });

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
        <div className="border-b border-[color:var(--color-card-border)] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Perfil do ateliê
          </p>
          <h1 className="mt-1 text-2xl font-black text-[color:var(--color-cream)]">
            Dados do perfil
          </h1>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input
            defaultValue={settings.fullName}
            label="Seu nome"
            name="fullName"
            required
          />
          <Input
            defaultValue={settings.atelierName ?? ""}
            hint="Aparece no topo do aplicativo para identificar seu ateliê."
            label="Nome do ateliê"
            name="atelierName"
          />
          <Input
            className="md:col-span-2"
            defaultValue={settings.whatsapp ?? ""}
            hint="Salvo como contato do ateliê, sem abrir conversa automaticamente."
            label="WhatsApp"
            name="whatsapp"
          />
        </div>
      </section>

      <aside className="space-y-5">
        <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Precificação
          </p>
          <h2 className="mt-1 text-2xl font-black text-[color:var(--color-cream)]">
            Multiplicadores
          </h2>
          <div className="mt-5 grid gap-4">
            <Input
              defaultValue={String(settings.minimumMultiplier).replace(".", ",")}
              hint="Usado para calcular o preço mínimo de novos produtos."
              inputMode="decimal"
              label="Multiplicador mínimo"
              name="minimumMultiplier"
              required
            />
            <Input
              defaultValue={String(settings.recommendedMultiplier).replace(".", ",")}
              hint="Usado para calcular o preço recomendado de novos produtos."
              inputMode="decimal"
              label="Multiplicador recomendado"
              name="recommendedMultiplier"
              required
            />
          </div>
          <div className="mt-5 rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.12)] p-4 text-sm leading-6 text-[color:var(--color-text-muted)]">
            Exemplo: se uma unidade custa R$ 10,00, multiplicador 1,5 sugere
            mínimo de R$ 15,00 e multiplicador 2 sugere R$ 20,00.
          </div>
        </section>

        <Button
          className="w-full"
          isLoading={isPending}
          leftIcon={<Save className="h-4 w-4" />}
          type="submit"
        >
          Salvar perfil
        </Button>

        {state.message ? (
          <p
            className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold ${
              state.status === "success"
                ? "bg-[rgba(104,98,70,0.12)] text-[color:var(--color-olive)]"
                : "bg-[rgba(160,82,70,0.12)] text-[color:var(--color-danger)]"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 text-sm leading-6 text-[color:var(--color-text-muted)] shadow-[var(--shadow-floating)] sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.18)] text-[color:var(--color-gold)]">
              <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-[color:var(--color-cream)]">
                Suporte
              </p>
              <a
                className="mt-1 inline-block break-all font-semibold text-[color:var(--color-gold)]"
                href="mailto:suporte@ateliearomatico.site"
              >
                suporte@ateliearomatico.site
              </a>
            </div>
          </div>
        </section>
      </aside>
    </form>
  );
}
