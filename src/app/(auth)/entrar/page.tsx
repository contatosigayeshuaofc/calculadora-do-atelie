import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import { SignInForm, SignUpForm } from "@/features/auth/auth-forms";
import { getAccessDecision } from "@/features/auth/access";
import { missingSupabaseMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const benefits = [
  "Calcule custo por unidade sem planilha confusa",
  "Receba preço mínimo e preço recomendado",
  "Registre clientes, pedidos e entregas em um só lugar",
];

type SignInPageProps = {
  searchParams?: Promise<{ motivo?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
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
      <section className="atelier-panel overflow-hidden">
        <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="flex flex-col justify-between border-b border-[color:var(--color-card-border)] bg-[color:var(--color-coffee)] p-8 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-xs font-black tracking-[0.24em] text-[color:var(--color-gold)]">
                ATELIÊ AROMÁTICO LUCRATIVO
              </p>
              <h1 className="mt-8 text-5xl font-black leading-[0.95] text-[color:var(--color-cream)] sm:text-6xl">
                Calculadora do Ateliê
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[color:var(--color-text-muted)]">
                Cadastre sua peça uma vez, descubra quanto ela custa e acompanhe suas vendas com clareza.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)]">
                  <Sparkles className="mt-0.5 h-5 w-5 text-[color:var(--color-gold)]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[color:var(--color-cream)]">{benefit}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-olive)] text-white shadow-sm">
                <span aria-hidden="true" className="text-2xl">🧮</span>
              </div>

              <h2 className="text-4xl font-black text-[color:var(--color-cream)]">
                Entre no seu ateliê
              </h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">Entre com seu e-mail e senha para acessar sua calculadora.</p>

              {isMissingConfig ? (
                <div className="mt-6 rounded-[var(--radius-sm)] border border-[rgba(160,82,69,0.25)] bg-[rgba(160,82,69,0.08)] p-4 text-sm leading-6 text-[color:var(--color-danger)]">
                  {missingSupabaseMessage}
                </div>
              ) : null}

              <div className="mt-8">
                <SignInForm />
              </div>

              <Link className="mt-4 inline-block text-sm font-semibold text-[color:var(--color-gold)]" href={"/recuperar-senha" as never}>
                Esqueci minha senha
              </Link>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 text-sm leading-6 text-[color:var(--color-text-muted)] shadow-[var(--shadow-floating)]">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold)]" aria-hidden="true" />
                <p>Contas novas ficarão aguardando liberação manual após confirmação da compra.</p>
              </div>

              <div className="mt-8 border-t border-[color:var(--color-card-border)] pt-8">
                <h3 className="text-3xl font-black leading-tight text-[color:var(--color-cream)]">Criar acesso</h3>
                <p className="mb-5 mt-1 text-sm leading-6 text-[color:var(--color-text-muted)]">
                  Cadastre seus dados para entrar na fila de liberação manual.
                </p>
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
