import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui";

export function AppHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-[rgba(201,191,177,0.72)] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-[var(--font-cinzel)] text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-antique-gold)]">
          Calculadora do Atelie
        </p>
        <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none text-[color:var(--color-warm-graphite)] sm:text-5xl">Painel</h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="atelier-field hidden h-10 min-w-64 items-center gap-2 rounded-[var(--radius-sm)] px-3 md:flex">
          <Search className="h-4 w-4 text-[color:var(--color-text-muted)]" aria-hidden="true" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-[rgba(111,103,94,0.72)]" placeholder="Buscar no atelie" type="search" />
        </label>
        <Button aria-label="Notificacoes" size="icon" variant="secondary">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
