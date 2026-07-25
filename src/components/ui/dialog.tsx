"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

type DialogProps = {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Dialog({ children, description, onClose, open, title }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(62,58,52,0.42)] p-4" role="presentation">
      <section
        aria-modal="true"
        aria-labelledby="atelier-dialog-title"
        className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[color:var(--color-card-border)] bg-[color:var(--color-plaster-white)] p-5 shadow-[var(--shadow-raised)]"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-black text-3xl leading-tight text-[color:var(--color-cream)]" id="atelier-dialog-title">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-muted)]">{description}</p> : null}
          </div>
          <Button aria-label="Fechar" onClick={onClose} size="icon" variant="ghost">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
