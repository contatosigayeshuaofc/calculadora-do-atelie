"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { getActiveNavHref } from "./nav-state";

export function Sidebar() {
  const activeHref = getActiveNavHref(usePathname());

  return (
    <aside className="atelier-rail fixed left-5 top-5 hidden h-[calc(100vh-40px)] w-64 flex-col rounded-[var(--radius-lg)] border p-4 lg:flex">
      <Link className="flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2" href={"/painel" as never}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-gold)] text-[color:var(--color-ink)] shadow-[var(--shadow-floating)]">
          <Leaf className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--color-gold)]">
            Ateliê
          </span>
          <span className="block truncate text-2xl font-medium leading-6 text-[color:var(--color-cream)]">
            Lucrativo
          </span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-medium transition",
                isActive
                  ? "bg-[color:var(--color-gold)] text-[color:var(--color-ink)] shadow-sm"
                  : "text-[color:var(--color-text-muted)] hover:bg-[rgba(196,168,130,0.12)] hover:text-[color:var(--color-cream)]",
              ].join(" ")}
              href={item.href as never}
              key={item.href}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[var(--radius-md)] border border-[color:var(--color-card-border)] bg-[rgba(48,42,37,0.88)] p-4 shadow-[var(--shadow-floating)]">
        <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-gold)]">Piloto</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
          Acesso liberado manualmente após a compra.
        </p>
      </div>
    </aside>
  );
}
