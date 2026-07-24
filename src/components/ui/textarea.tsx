import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

export function Textarea({ className, hint, id, label, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block" htmlFor={textareaId}>
      {label ? <span className="text-sm font-semibold text-[color:var(--color-warm-graphite)]">{label}</span> : null}
      <textarea
        className={cn("atelier-field mt-2 min-h-28 w-full resize-y rounded-[var(--radius-sm)] px-3.5 py-3 text-sm leading-6", className)}
        id={textareaId}
        {...props}
      />
      {hint ? <span className="mt-1.5 block text-xs text-[color:var(--color-text-muted)]">{hint}</span> : null}
    </label>
  );
}
