import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ className, error, hint, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-[color:var(--color-warm-graphite)]">{label}</span> : null}
      <input
        className={cn("atelier-field mt-2 h-11 w-full rounded-[var(--radius-sm)] px-3.5 text-sm", className)}
        id={inputId}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-[color:var(--color-danger)]">{error}</span> : null}
      {!error && hint ? <span className="mt-1.5 block text-xs text-[color:var(--color-text-muted)]">{hint}</span> : null}
    </label>
  );
}
