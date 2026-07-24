"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { signOutAction } from "@/features/auth/actions";
import { navItems } from "./nav-items";
import { getActiveNavHref } from "./nav-state";

type AppHeaderProps = {
  atelierName?: string | null;
};

export function AppHeader({ atelierName }: AppHeaderProps) {
  const activeHref = getActiveNavHref(usePathname());
  const title = navItems.find((item) => item.href === activeHref)?.label ?? "Painel";

  return (
    <header className="flex flex-col gap-4 border-b border-[rgba(201,191,177,0.72)] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-[var(--font-cinzel)] text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-antique-gold)]">
          {atelierName || "Calculadora do Atelie"}
        </p>
        <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none text-[color:var(--color-warm-graphite)] sm:text-5xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="atelier-field hidden h-10 min-w-64 items-center gap-2 rounded-[var(--radius-sm)] px-3 md:flex">
          <Search className="h-4 w-4 text-[color:var(--color-text-muted)]" aria-hidden="true" />
          <input aria-label="Buscar no atelie" className="w-full bg-transparent text-sm outline-none placeholder:text-[rgba(111,103,94,0.72)]" placeholder="Buscar no atelie" type="search" />
        </label>
        <Button aria-label="Notificacoes" size="icon" variant="secondary">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>
        <form action={signOutAction}>
          <Button aria-label="Sair" size="icon" type="submit" variant="ghost">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </header>
  );
}
