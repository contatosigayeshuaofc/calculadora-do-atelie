import Link from "next/link";
import { navItems } from "./nav-items";

const mobileItems = navItems.slice(0, 5);

export function MobileNav() {
  return (
    <nav
      aria-label="Navegacao mobile"
      className="atelier-rail fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[var(--radius-lg)] border p-1.5 lg:hidden"
    >
      {mobileItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === 0;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex h-12 flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] text-[10px] font-bold transition",
              isActive ? "bg-[color:var(--color-olive)] text-white" : "text-[color:var(--color-text-muted)] hover:bg-[rgba(201,191,177,0.26)]",
            ].join(" ")}
            href={item.href as never}
            key={item.href}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
