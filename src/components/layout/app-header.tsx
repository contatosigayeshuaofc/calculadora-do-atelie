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
  const displayAtelierName = formatAtelierName(atelierName);

  return (
    <header className="relative border-b border-[rgba(196,168,130,0.22)] pb-5">
      <div className="min-h-14 px-12 text-center sm:px-32">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-gold)]">
          {displayAtelierName}
        </p>
        <h1 className="mt-2 text-3xl font-medium leading-none text-[color:var(--color-cream)] sm:text-4xl">
          {title}
        </h1>
      </div>

      <div className="absolute right-0 top-0 flex items-center gap-1.5">
        <Button aria-label="Buscar no ateliê" size="icon" variant="ghost">
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button aria-label="Notificações" size="icon" variant="secondary">
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

function formatAtelierName(value?: string | null) {
  return (value || "Calculadora do Ateliê").replace(/\bAtelie\b/g, "Ateliê");
}
