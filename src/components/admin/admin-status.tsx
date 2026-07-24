import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { AccessStatus } from "@/types/database";

const statusConfig: Record<
  AccessStatus,
  {
    icon: typeof CheckCircle2;
    label: string;
    tone: "danger" | "neutral" | "success" | "warning";
  }
> = {
  active: { icon: CheckCircle2, label: "Ativo", tone: "success" },
  pending: { icon: Clock3, label: "Pendente", tone: "warning" },
  suspended: { icon: XCircle, label: "Cancelado", tone: "danger" },
};

export function AdminStatus({ status }: { status: AccessStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <StatusBadge tone={config.tone}>
      <span className="inline-flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {config.label}
      </span>
    </StatusBadge>
  );
}
