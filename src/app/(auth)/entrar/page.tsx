import { ArrowRight, Calculator, LockKeyhole, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";

const benefits = [
  "Calcule custo por unidade sem planilha confusa",
  "Receba preco minimo e preco recomendado",
  "Registre clientes, pedidos e entregas em um so lugar",
];

export default function SignInPage() {
  return (
    <main className="atelier-shell">
      <section className="atelier-panel overflow-hidden">
        <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="flex flex-col justify-between border-b border-[color:var(--color-clay-beige)] bg-[color:var(--color-paper)] p-8 lg:border-b-0 lg:border-r">
            <div>
              <p className="font-[var(--font-cinzel)] text-xs tracking-[0.24em] text-[color:var(--color-antique-gold)]">
                ATELIE AROMATICO LUCRATIVO
              </p>
              <h1 className="mt-8 font-[var(--font-cormorant)] text-5xl leading-[0.95] text-[color:var(--color-warm-graphite)] sm:text-6xl">
                Calculadora do Atelie
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[color:var(--color-text-muted)]">
                Cadastre sua peca uma vez, descubra quanto ela custa e acompanhe suas vendas com clareza.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 rounded-xl border border-[color:var(--color-clay-beige)] bg-[color:var(--color-plaster-white)] p-4">
                  <Sparkles className="mt-0.5 h-5 w-5 text-[color:var(--color-olive)]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[color:var(--color-warm-graphite)]">{benefit}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-olive)] text-white shadow-sm">
                <Calculator className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="font-[var(--font-cormorant)] text-4xl text-[color:var(--color-warm-graphite)]">
                Entre no seu atelie
              </h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
                A autenticacao com Supabase entra na proxima etapa. Esta tela ja prepara a experiencia do MVP.
              </p>

              <form className="mt-8 space-y-5">
                <Input label="E-mail" placeholder="voce@email.com" type="email" />
                <Input label="Senha" placeholder="Sua senha" type="password" />

                <Button className="w-full" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />} size="lg">
                  Entrar
                </Button>
              </form>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-[color:var(--color-clay-beige)] bg-[color:var(--color-paper)] p-4 text-sm leading-6 text-[color:var(--color-text-muted)]">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-muted-lavender)]" aria-hidden="true" />
                <p>Contas novas ficarao aguardando liberacao manual apos confirmacao da compra.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
