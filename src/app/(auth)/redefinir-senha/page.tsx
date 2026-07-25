import Link from "next/link";
import { ResetPasswordForm } from "@/features/auth/auth-forms";

export default function ResetPasswordPage() {
  return (
    <main className="atelier-shell">
      <section className="atelier-panel w-full max-w-lg p-6 sm:p-10">
        <p className="font-[var(--font-cinzel)] text-xs font-normal uppercase tracking-[0.22em] text-[color:var(--color-antique-gold)]">
          Nova senha
        </p>
        <h1 className="mt-4 font-medium text-4xl leading-none text-[color:var(--color-cream)]">Redefinir senha</h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--color-text-muted)]">
          Crie uma senha nova para voltar ao seu ateliê.
        </p>
        <ResetPasswordForm />
        <Link className="mt-6 inline-block text-sm font-semibold text-[color:var(--color-olive-dark)]" href={"/entrar" as never}>
          Voltar para entrar
        </Link>
      </section>
    </main>
  );
}
