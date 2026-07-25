import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui";

export default function AppLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <section
        aria-label="Carregando"
        className="w-full max-w-xl rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-5 text-center shadow-[var(--shadow-floating)]"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(196,168,130,0.16)] text-[color:var(--color-gold)]">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-2xl font-medium text-[color:var(--color-cream)]">
          Carregando
        </h1>
        <p className="mt-2 text-sm font-normal leading-6 text-[color:var(--color-text-muted)]">
          Preparando as informações do seu ateliê.
        </p>
        <div className="mt-5 grid gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mx-auto h-3 w-4/5" />
          <Skeleton className="mx-auto h-3 w-2/3" />
        </div>
      </section>
    </div>
  );
}
