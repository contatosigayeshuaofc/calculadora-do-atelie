"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { createManualUserAction } from "@/features/admin/actions";
import type { AdminActionState } from "@/features/admin/types";
import { Button, Input } from "@/components/ui";

const initialState: AdminActionState = {
  message: "",
  status: "idle",
};

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createManualUserAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="atelier-panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--color-muted-lavender)]">Novo acesso</p>
          <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl leading-none text-[color:var(--color-warm-graphite)]">
            Cadastrar cliente manualmente
          </h2>
        </div>
        <span className="hidden h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[rgba(92,117,82,0.12)] text-[color:var(--color-olive)] sm:flex">
          <UserPlus className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Nome da cliente" name="fullName" placeholder="Ana Souza" required />
        <Input label="E-mail de acesso" name="email" placeholder="ana@email.com" required type="email" />
        <label className="block" htmlFor="password">
          <span className="text-sm font-semibold text-[color:var(--color-warm-graphite)]">Senha temporaria</span>
          <span className="mt-2 flex h-11 overflow-hidden rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white focus-within:border-[color:var(--color-olive)] focus-within:ring-2 focus-within:ring-[rgba(104,98,70,0.14)]">
            <input
              className="min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none"
              id="password"
              name="password"
              placeholder="Minimo 6 caracteres"
              required
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="flex h-full w-11 shrink-0 items-center justify-center text-[color:var(--color-muted-lavender)] transition hover:text-[color:var(--color-olive)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--color-antique-gold)]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </span>
        </label>
        <Input label="WhatsApp" name="whatsapp" placeholder="Opcional" />
        <Input className="sm:col-span-2" label="Nome do atelie" name="atelierName" placeholder="Opcional" />
      </div>

      {state.message ? (
        <p
          className={[
            "mt-4 rounded-[var(--radius-sm)] border px-3 py-2 text-sm",
            state.status === "success"
              ? "border-[rgba(92,117,82,0.24)] bg-[rgba(92,117,82,0.1)] text-[color:var(--color-success)]"
              : "border-[rgba(155,79,69,0.24)] bg-[rgba(155,79,69,0.1)] text-[color:var(--color-danger)]",
          ].join(" ")}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end">
        <Button isLoading={isPending} leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />} type="submit">
          Criar e liberar
        </Button>
      </div>
    </form>
  );
}
