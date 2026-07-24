import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="atelier-app-bg min-h-screen">
      <Sidebar />
      <div className="min-h-screen px-4 pb-24 pt-4 lg:ml-72 lg:px-8 lg:pb-8 lg:pt-5">
        <main className="atelier-rail min-h-[calc(100vh-40px)] rounded-[var(--radius-lg)] border p-4 sm:p-6 lg:p-8">
          <AppHeader />
          <div className="pt-6">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
