import { redirect } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { SignUpForm } from "@/features/auth/auth-forms";
import { getAccessDecision } from "@/features/auth/access";
import { missingSupabaseMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type CreateAccessPageProps = {
  searchParams?: Promise<{ motivo?: string }>;
};

export default async function CreateAccessPage({ searchParams }: CreateAccessPageProps) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const decision = await getAccessDecision(supabase, user);
      redirect(decision.destination as never);
    }
  }

  const isMissingConfig = resolvedSearchParams?.motivo === "configuracao" || !supabase;

  return (
    <main className="atelier-shell">
      <section className="atelier-panel w-full max-w-lg p-6 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(196,168,130,0.18)] text-[color:var(--color-gold)] shadow-sm">
          <span aria-hidden="true" className="text-2xl">
            ✨
          </span>
        </div>

        <p className="mt-6 text-center text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
          Primeiro acesso
        </p>
        <h1 className="mt-3 text-center text-4xl font-medium leading-tight text-[color:var(--color-cream)]">
          Criar acesso
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-[color:var(--color-text-muted)]">
          Cadastre seus dados para preparar seu acesso ao app.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 text-sm leading-6 text-[color:var(--color-text-muted)] shadow-[var(--shadow-floating)]">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold)]" aria-hidden="true" />
          <p>Contas novas serão liberadas automaticamente em até 24horas após o cadastro.</p>
        </div>

        {isMissingConfig ? (
          <div className="mt-6 rounded-[var(--radius-sm)] border border-[rgba(160,82,69,0.25)] bg-[rgba(160,82,69,0.08)] p-4 text-sm leading-6 text-[color:var(--color-danger)]">
            {missingSupabaseMessage}
          </div>
        ) : null}

        <div className="mt-8">
          <SignUpForm />
        </div>

        <Link className="mt-6 inline-block w-full text-center text-sm font-medium text-[color:var(--color-gold)]" href={"/entrar" as never}>
          Já tenho acesso
        </Link>
      </section>
    </main>
  );
}
