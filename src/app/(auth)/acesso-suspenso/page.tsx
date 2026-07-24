import { ShieldAlert } from "lucide-react";

export default function SuspendedAccessPage() {
  return (
    <main className="atelier-shell">
      <section className="atelier-panel w-full max-w-xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(160,82,69,0.1)] text-[color:var(--color-danger)]">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-[var(--font-cormorant)] text-5xl leading-none text-[color:var(--color-warm-graphite)]">Acesso suspenso</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[color:var(--color-text-muted)]">
          Seu acesso nao esta ativo no momento. Entre em contato pelo canal de suporte da compra para regularizar.
        </p>
      </section>
    </main>
  );
}
