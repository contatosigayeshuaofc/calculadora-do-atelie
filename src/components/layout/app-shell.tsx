import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  atelierName?: string | null;
  children: ReactNode;
};

export function AppShell({ atelierName, children }: AppShellProps) {
  return (
    <div className="atelier-app-bg min-h-screen">
      <Sidebar />
      <div
        className="min-h-screen px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 lg:ml-72 lg:px-8 lg:pb-8 lg:pt-5"
        data-testid="app-shell-content"
      >
        <main className="atelier-rail min-h-[calc(100vh-40px)] rounded-[var(--radius-lg)] border p-4 sm:p-6 lg:p-8">
          <AppHeader atelierName={atelierName} />
          <div className="pt-6">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
