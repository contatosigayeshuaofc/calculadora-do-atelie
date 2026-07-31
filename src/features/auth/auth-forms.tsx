"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowRight, Mail, UserPlus } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { getCurrencyOption } from "@/lib/currency/supported-currencies";
import { formatWhatsappForCountry } from "@/lib/forms/international-phone-input";
import { getCountryOption, getDefaultCurrencyForCountry, supportedCountries } from "@/lib/localization/countries";
import {
  type AuthActionState,
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
} from "./actions";

const initialAuthActionState: AuthActionState = {
  message: "",
  status: "idle",
};

function ActionMessage({ message, status }: { message: string; status: "idle" | "error" | "success" }) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={[
        "rounded-[var(--radius-sm)] border px-3 py-2 text-sm leading-6",
        status === "success"
          ? "border-[rgba(98,121,88,0.28)] bg-[rgba(98,121,88,0.1)] text-[color:var(--color-olive-dark)]"
          : "border-[rgba(160,82,69,0.25)] bg-[rgba(160,82,69,0.08)] text-[color:var(--color-danger)]",
      ].join(" ")}
      role="status"
    >
      {message}
    </p>
  );
}

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <Input autoComplete="email" label="E-mail" name="email" placeholder="voce@email.com" type="email" />
      <Input autoComplete="current-password" label="Senha" name="password" placeholder="Sua senha" type="password" />
      <ActionMessage message={state.message} status={state.status} />
      <Button
        className="w-full"
        isLoading={isPending}
        rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        size="lg"
        type="submit"
      >
        Entrar
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialAuthActionState);
  const [countryCode, setCountryCode] = useState("BR");
  const [whatsapp, setWhatsapp] = useState("");
  const selectedCountry = useMemo(() => getCountryOption(countryCode), [countryCode]);
  const selectedCurrency = useMemo(() => getCurrencyOption(getDefaultCurrencyForCountry(countryCode)), [countryCode]);

  return (
    <form action={formAction} className="space-y-4">
      <Input autoComplete="name" label="Nome" name="fullName" placeholder="Seu nome" />
      <Input label="Nome do ateliê" name="atelierName" placeholder="Ex: Ateliê da Ana" />
      <Select
        hint={`Vamos usar +${selectedCountry.callingCode} no WhatsApp e ${selectedCurrency.code} como moeda inicial.`}
        label="País de venda"
        name="countryCode"
        onChange={(event) => {
          const nextCountry = event.target.value;
          setCountryCode(nextCountry);
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
      <input name="currencyCode" type="hidden" value={selectedCurrency.code} />
      <Input
        autoComplete="tel"
        inputMode="tel"
        label="WhatsApp"
        name="whatsapp"
        onChange={(event) => setWhatsapp(formatWhatsappForCountry(event.target.value, countryCode))}
        placeholder={`+${selectedCountry.callingCode}`}
        value={whatsapp}
      />
      <Input autoComplete="email" label="E-mail" name="email" placeholder="voce@email.com" type="email" />
      <Input
        autoComplete="new-password"
        hint="Mínimo de 6 caracteres."
        label="Senha"
        name="password"
        placeholder="Crie uma senha"
        type="password"
      />
      <ActionMessage message={state.message} status={state.status} />
      <Button
        className="w-full"
        isLoading={isPending}
        leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
        size="lg"
        type="submit"
        variant="secondary"
      >
        Criar conta
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialAuthActionState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <Input autoComplete="email" label="E-mail" name="email" placeholder="voce@email.com" type="email" />
      <ActionMessage message={state.message} status={state.status} />
      <Button
        className="w-full"
        isLoading={isPending}
        leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
        size="lg"
        type="submit"
      >
        Enviar link
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialAuthActionState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <Input autoComplete="new-password" label="Nova senha" name="password" placeholder="Nova senha" type="password" />
      <Input
        autoComplete="new-password"
        label="Confirmar senha"
        name="confirmPassword"
        placeholder="Repita a nova senha"
        type="password"
      />
      <ActionMessage message={state.message} status={state.status} />
      <Button className="w-full" isLoading={isPending} size="lg" type="submit">
        Atualizar senha
      </Button>
    </form>
  );
}
