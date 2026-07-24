import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { Button } from "@/components/ui";
import { signOutAction } from "@/features/auth/actions";
import { listAdminUsers } from "@/features/admin/queries";
import { missingSupabaseAdminMessage } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const overview = await listAdminUsers();

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] px-4 py-5 text-[color:var(--color-warm-graphite)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-[color:var(--color-clay-beige)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-olive)] text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-antique-gold)]">Administracao</p>
              <h1 className="mt-1 font-[var(--font-cormorant)] text-5xl leading-none">Acessos das clientes</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--color-text-muted)]">
                Aprove cadastros pendentes, cancele acessos e crie uma cliente manualmente quando a venda acontecer fora do fluxo normal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={"/painel" as never}>
              <Button leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />} variant="secondary">
                Voltar ao app
              </Button>
            </Link>
            <form action={signOutAction}>
              <Button leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />} type="submit" variant="ghost">
                Sair
              </Button>
            </form>
          </div>
        </header>

        {overview.needsAdminSetup ? (
          <section className="atelier-panel mt-6 p-5 sm:p-6">
            <p className="text-sm font-semibold text-[color:var(--color-danger)]">{missingSupabaseAdminMessage}</p>
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Total" value={overview.stats.total} />
              <Metric label="Pendentes" value={overview.stats.pending} />
              <Metric label="Ativos" value={overview.stats.active} />
              <Metric label="Cancelados" value={overview.stats.suspended} />
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.5fr]">
              <CreateUserForm />
              <AdminUsersTable users={overview.users} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="atelier-panel p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--color-muted-lavender)]">{label}</p>
      <p className="mt-2 font-[var(--font-cormorant)] text-4xl leading-none text-[color:var(--color-warm-graphite)]">{value}</p>
    </div>
  );
}
