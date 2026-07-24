import Link from "next/link";
import { Sparkles } from "lucide-react";
import { navItems } from "./nav-items";

export function Sidebar() {
  return (
    <aside className="atelier-rail fixed left-5 top-5 hidden h-[calc(100vh-40px)] w-64 flex-col rounded-[var(--radius-lg)] border p-4 lg:flex">
      <Link className="flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2" href={"/painel" as never}>
        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-olive)] text-white">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-[var(--font-cinzel)] text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-antique-gold)]">
            Atelie
          </span>
          <span className="block font-[var(--font-cormorant)] text-2xl leading-6 text-[color:var(--color-warm-graphite)]">Lucrativo</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Navegacao principal">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 0;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-[color:var(--color-olive)] text-white shadow-sm"
                  : "text-[color:var(--color-text-muted)] hover:bg-[rgba(201,191,177,0.26)] hover:text-[color:var(--color-warm-graphite)]",
              ].join(" ")}
              href={item.href as never}
              key={item.href}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[var(--radius-md)] border border-[color:var(--color-clay-beige)] bg-[rgba(236,232,225,0.7)] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-muted-lavender)]">Piloto</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">Acesso liberado manualmente apos a compra.</p>
      </div>
    </aside>
  );
}
