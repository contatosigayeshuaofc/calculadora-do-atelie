"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ reset }: AppErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-surface)] px-4 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-white p-6 text-center shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
          Ops
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[color:var(--color-text)]">
          Nao foi possivel carregar esta tela
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
          Tente novamente em alguns instantes. Se continuar acontecendo, fale com o suporte.
        </p>
        <Button className="mt-6 w-full" onClick={reset} type="button">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Tentar novamente
        </Button>
      </section>
    </main>
  );
}
