import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";
import { requireActiveUser } from "@/lib/auth/require-active-user";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireActiveUser();

  return <AppShell atelierName={profile.atelier_name}>{children}</AppShell>;
}
