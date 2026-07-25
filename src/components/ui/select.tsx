import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

export function Select({ children, className, hint, id, label, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="block" htmlFor={selectId}>
      {label ? <span className="text-sm font-semibold text-[color:var(--color-cream)]">{label}</span> : null}
      <select className={cn("atelier-field mt-2 h-11 w-full rounded-[var(--radius-sm)] px-3.5 text-sm", className)} id={selectId} {...props}>
        {children}
      </select>
      {hint ? <span className="mt-1.5 block text-xs text-[color:var(--color-text-muted)]">{hint}</span> : null}
    </label>
  );
}
