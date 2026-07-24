import { Check, ShieldCheck, X } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { updateUserAccessAction } from "@/features/admin/actions";
import type { AdminUserSummary } from "@/features/admin/types";
import { AdminStatus } from "./admin-status";

function formatDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function displayName(user: AdminUserSummary) {
  return user.fullName || user.email || "Cliente sem nome";
}

export function AdminUsersTable({ users }: { users: AdminUserSummary[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        description="Quando uma cliente se cadastrar, ela aparecera aqui para analise."
        icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        title="Nenhum usuario encontrado"
      />
    );
  }

  return (
    <section className="atelier-panel overflow-hidden">
      <div className="border-b border-[color:var(--color-clay-beige)] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--color-muted-lavender)]">Analise de acessos</p>
        <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl leading-none text-[color:var(--color-warm-graphite)]">
          Usuarios cadastrados
        </h2>
      </div>

      <div className="divide-y divide-[color:var(--color-clay-beige)]">
        {users.map((user) => (
          <article className="grid gap-4 p-5 sm:grid-cols-[1.4fr_0.9fr_auto] sm:items-center sm:p-6" key={user.id}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-bold text-[color:var(--color-warm-graphite)]">{displayName(user)}</h3>
                <AdminStatus status={user.status} />
              </div>
              <p className="mt-1 truncate text-sm text-[color:var(--color-text-muted)]">{user.email ?? "E-mail nao encontrado"}</p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                Cadastro em {formatDate(user.createdAt)}
                {user.activatedAt ? ` - liberado em ${formatDate(user.activatedAt)}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:block sm:space-y-1">
              <p>
                <span className="block text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--color-muted-lavender)]">Atelie</span>
                <span className="text-[color:var(--color-warm-graphite)]">{user.atelierName || "Nao informado"}</span>
              </p>
              <p>
                <span className="block text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--color-muted-lavender)]">WhatsApp</span>
                <span className="text-[color:var(--color-warm-graphite)]">{user.whatsapp || "Nao informado"}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {user.status !== "active" ? (
                <form action={updateUserAccessAction}>
                  <input name="userId" type="hidden" value={user.id} />
                  <input name="accessStatus" type="hidden" value="active" />
                  <Button leftIcon={<Check className="h-4 w-4" aria-hidden="true" />} size="sm" type="submit">
                    Aprovar
                  </Button>
                </form>
              ) : null}
              {user.status !== "suspended" ? (
                <form action={updateUserAccessAction}>
                  <input name="userId" type="hidden" value={user.id} />
                  <input name="accessStatus" type="hidden" value="suspended" />
                  <Button leftIcon={<X className="h-4 w-4" aria-hidden="true" />} size="sm" type="submit" variant="danger">
                    Cancelar
                  </Button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
