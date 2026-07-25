import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/auth-forms";

export default function ForgotPasswordPage() {
  return (
    <main className="atelier-shell">
      <section className="atelier-panel w-full max-w-lg p-6 text-center sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
          Recuperação
        </p>
        <h1 className="mt-4 text-4xl font-medium leading-none text-[color:var(--color-cream)]">Recuperar senha</h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--color-text-muted)]">
          Digite seu e-mail e enviaremos um link para criar uma nova senha.
        </p>
        <ForgotPasswordForm />
        <Link className="mt-6 inline-block text-sm font-semibold text-[color:var(--color-gold)]" href={"/entrar" as never}>
          Voltar para entrar
        </Link>
      </section>
    </main>
  );
}
