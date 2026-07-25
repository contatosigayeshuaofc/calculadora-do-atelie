import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  actionLabel?: string;
  icon?: ReactNode;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({ action, actionLabel, className, description, icon, onAction, title }: EmptyStateProps) {
  return (
    <section className={cn("rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-6 text-center shadow-[var(--shadow-floating)]", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(196,168,130,0.18)] text-[color:var(--color-gold)]">
        {icon ?? <Sparkles className="h-5 w-5" aria-hidden="true" />}
      </div>
      <h2 className="mt-4 text-3xl font-medium leading-tight text-[color:var(--color-cream)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--color-text-muted)]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
      {!action && actionLabel ? <Button className="mt-5" onClick={onAction}>{actionLabel}</Button> : null}
    </section>
  );
}
