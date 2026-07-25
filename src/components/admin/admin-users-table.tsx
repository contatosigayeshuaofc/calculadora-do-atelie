import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/ui";
import type { AdminUserSummary } from "@/features/admin/types";
import type { AccessStatus } from "@/types/database";
import { AdminAccessActionForm } from "./admin-access-action-form";
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

const statusGroups: Array<{ description: string; label: string; status: AccessStatus }> = [
  {
    description: "Cadastros que precisam de aprovação antes da cliente acessar o app.",
    label: "Pendentes",
    status: "pending",
  },
  {
    description: "Clientes liberadas para usar a calculadora e registrar vendas.",
    label: "Ativos",
    status: "active",
  },
  {
    description: "Acessos cancelados que não entram mais no app.",
    label: "Cancelados",
    status: "suspended",
  },
];

export function AdminUsersTable({ users }: { users: AdminUserSummary[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        description="Quando uma cliente se cadastrar, ela aparecerá aqui para análise."
        icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        title="Nenhum usuário encontrado"
      />
    );
  }

  return (
    <section className="atelier-panel overflow-hidden">
      <div className="border-b border-[color:var(--color-card-border)] p-5 sm:p-6">
        <p className="text-xs font-normal uppercase tracking-[0.16em] text-[color:var(--color-gold)]">Análise de acessos</p>
        <h2 className="mt-2 text-3xl font-medium leading-none text-[color:var(--color-cream)]">
          Usuários cadastrados
        </h2>
      </div>

      <div className="divide-y divide-[color:var(--color-card-border)]">
        {statusGroups.map((group) => {
          const groupUsers = users.filter((user) => user.status === group.status);

          return (
            <section aria-label={group.label} className="bg-[rgba(24,21,18,0.32)]" key={group.status}>
              <div className="border-b border-[color:var(--color-card-border)] bg-[rgba(245,180,72,0.06)] px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[color:var(--color-cream)]">{group.label}</h3>
                  <span className="rounded-full bg-[rgba(245,180,72,0.12)] px-2.5 py-1 text-xs font-bold text-[color:var(--color-gold)]">
                    {groupUsers.length}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[color:var(--color-text-muted)]">{group.description}</p>
              </div>

              {groupUsers.length > 0 ? (
                <div className="divide-y divide-[color:var(--color-card-border)]">
                  {groupUsers.map((user) => (
                    <AdminUserRow key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <p className="px-5 py-5 text-sm text-[color:var(--color-text-muted)] sm:px-6">Nenhuma cliente neste status.</p>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function AdminUserRow({ user }: { user: AdminUserSummary }) {
  return (
    <article className="grid gap-4 p-5 sm:grid-cols-[1.4fr_0.9fr_auto] sm:items-center sm:p-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-base font-bold text-[color:var(--color-cream)]">{displayName(user)}</h4>
          <AdminStatus status={user.status} />
        </div>
        <p className="mt-1 truncate text-sm text-[color:var(--color-text-muted)]">{user.email ?? "E-mail não encontrado"}</p>
        <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
          Cadastro em {formatDate(user.createdAt)}
          {user.activatedAt ? ` - liberado em ${formatDate(user.activatedAt)}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:block sm:space-y-1">
        <p>
          <span className="block text-xs font-normal uppercase tracking-[0.1em] text-[color:var(--color-gold)]">Ateliê</span>
          <span className="text-[color:var(--color-cream)]">{user.atelierName || "Não informado"}</span>
        </p>
        <p>
          <span className="block text-xs font-normal uppercase tracking-[0.1em] text-[color:var(--color-gold)]">WhatsApp</span>
          <span className="text-[color:var(--color-cream)]">{user.whatsapp || "Não informado"}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        {user.status !== "active" ? <AdminAccessActionForm actionLabel="Aprovar" status="active" userId={user.id} /> : null}
        {user.status !== "suspended" ? <AdminAccessActionForm actionLabel="Cancelar" status="suspended" userId={user.id} /> : null}
      </div>
    </article>
  );
}
