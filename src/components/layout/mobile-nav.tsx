"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { getActiveNavHref } from "./nav-state";

const mobileItems = navItems.filter((item) => item.label !== "Precificar");

export function MobileNav() {
  const activeHref = getActiveNavHref(usePathname());

  return (
    <nav
      aria-label="Navegação mobile"
      className="atelier-rail fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 grid grid-cols-5 rounded-[var(--radius-lg)] border p-1.5 lg:hidden"
    >
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === activeHref;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-1 text-[10px] font-medium leading-none transition",
              isActive
                ? "bg-[color:var(--color-gold)] text-[color:var(--color-ink)]"
                : "text-[color:var(--color-text-muted)] hover:bg-[rgba(196,168,130,0.12)]",
            ].join(" ")}
            href={item.href as never}
            key={item.href}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
