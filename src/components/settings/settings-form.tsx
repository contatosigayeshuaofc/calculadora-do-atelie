"use client";

import { useActionState, useMemo, useState } from "react";
import { LifeBuoy, Save } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { saveSettingsAction } from "@/features/settings/actions";
import type { AtelierSettings } from "@/features/settings/types";
import { formatCurrency } from "@/lib/currency/format-currency";
import { getCurrencyOption, supportedCurrencies } from "@/lib/currency/supported-currencies";
import { formatWhatsappForCountry } from "@/lib/forms/international-phone-input";
import { getCountryOption, getDefaultCurrencyForCountry, supportedCountries } from "@/lib/localization/countries";

type SettingsFormProps = {
  settings: AtelierSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, action, isPending] = useActionState(saveSettingsAction, {
    message: null,
    status: "idle" as const,
  });
  const [countryCode, setCountryCode] = useState(settings.countryCode);
  const [currencyCode, setCurrencyCode] = useState(settings.currencyCode);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp ?? "");
  const selectedCountry = useMemo(() => getCountryOption(countryCode), [countryCode]);
  const selectedCurrency = useMemo(() => getCurrencyOption(currencyCode), [currencyCode]);

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
        <div className="border-b border-[color:var(--color-card-border)] pb-4 text-center">
          <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Perfil do ateliê
          </p>
          <h1 className="mt-1 text-2xl font-medium text-[color:var(--color-cream)]">Dados do perfil</h1>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input defaultValue={settings.fullName} label="Seu nome" name="fullName" required />
          <Input
            defaultValue={settings.atelierName ?? ""}
            hint="Aparece no topo do aplicativo para identificar seu ateliê."
            label="Nome do ateliê"
            name="atelierName"
          />
          <Select
            hint={`Define o DDI +${selectedCountry.callingCode} para o WhatsApp.`}
            label="País de venda"
            name="countryCode"
            onChange={(event) => {
              const nextCountry = event.target.value;
              setCountryCode(nextCountry);
              setCurrencyCode(getDefaultCurrencyForCountry(nextCountry));
              setWhatsapp((current) => formatWhatsappForCountry(current, nextCountry));
            }}
            required
            value={countryCode}
          >
            {supportedCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label} (+{country.callingCode})
              </option>
            ))}
          </Select>
          <Select
            hint="Todos os campos de valor e relatórios passam a usar essa moeda."
            label="Moeda de compra e venda"
            name="currencyCode"
            onChange={(event) => setCurrencyCode(event.target.value)}
            required
            value={currencyCode}
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code} - {currency.label}
              </option>
            ))}
          </Select>
          <Input
            className="md:col-span-2"
            hint={`Salvo com DDI +${selectedCountry.callingCode}, sem abrir conversa automaticamente.`}
            inputMode="tel"
            label="WhatsApp"
            name="whatsapp"
            onChange={(event) => setWhatsapp(formatWhatsappForCountry(event.target.value, countryCode))}
            placeholder={`+${selectedCountry.callingCode}`}
            value={whatsapp}
          />
        </div>
      </section>

      <aside className="space-y-5">
        <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
          <p className="text-center text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Precificação
          </p>
          <h2 className="mt-1 text-center text-2xl font-medium text-[color:var(--color-cream)]">Multiplicadores</h2>
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
            Exemplo: se uma unidade custa {formatCurrency(1000, selectedCurrency.code)}, multiplicador 1,5 sugere
            mínimo de {formatCurrency(1500, selectedCurrency.code)} e multiplicador 2 sugere{" "}
            {formatCurrency(2000, selectedCurrency.code)}.
          </div>
        </section>

        <Button className="w-full" isLoading={isPending} leftIcon={<Save className="h-4 w-4" />} type="submit">
          Salvar perfil
        </Button>

        {state.message ? (
          <p
            className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium ${
              state.status === "success"
                ? "bg-[rgba(104,98,70,0.12)] text-[color:var(--color-olive)]"
                : "bg-[rgba(160,82,70,0.12)] text-[color:var(--color-danger)]"
            }`}
            role={state.status === "success" ? "status" : "alert"}
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
              <p className="font-medium text-[color:var(--color-cream)]">Suporte</p>
              <a
                className="mt-1 inline-flex min-h-11 items-center break-all font-medium text-[color:var(--color-gold)]"
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
