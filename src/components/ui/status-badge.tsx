import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatusBadgeTone = "success" | "warning" | "danger" | "neutral" | "lavender";

const toneClasses: Record<StatusBadgeTone, string> = {
  success: "border-[rgba(92,117,82,0.28)] bg-[rgba(92,117,82,0.12)] text-[color:var(--color-success)]",
  warning: "border-[rgba(162,116,50,0.28)] bg-[rgba(162,116,50,0.13)] text-[color:var(--color-warning)]",
  danger: "border-[rgba(155,79,69,0.28)] bg-[rgba(155,79,69,0.12)] text-[color:var(--color-danger)]",
  neutral: "border-[rgba(201,191,177,0.7)] bg-[rgba(248,246,241,0.76)] text-[color:var(--color-text-muted)]",
  lavender: "border-[rgba(130,117,138,0.28)] bg-[rgba(130,117,138,0.12)] text-[color:var(--color-muted-lavender)]",
};

type StatusBadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ children, className, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium leading-none", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
