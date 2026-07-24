"use client";

import { useActionState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui";
import { updateUserAccessAction } from "@/features/admin/actions";
import type { AdminActionState } from "@/features/admin/types";
import type { ManagedAccessStatus } from "@/features/admin/schemas";

const initialState: AdminActionState = {
  message: "",
  status: "idle",
};

type AdminAccessActionFormProps = {
  actionLabel: string;
  status: ManagedAccessStatus;
  userId: string;
};

export function AdminAccessActionForm({ actionLabel, status, userId }: AdminAccessActionFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserAccessAction, initialState);
  const Icon = status === "active" ? Check : X;

  return (
    <form action={formAction} className="space-y-2">
      <input name="userId" type="hidden" value={userId} />
      <input name="accessStatus" type="hidden" value={status} />
      <Button
        isLoading={isPending}
        leftIcon={<Icon className="h-4 w-4" aria-hidden="true" />}
        size="sm"
        type="submit"
        variant={status === "suspended" ? "danger" : "primary"}
      >
        {actionLabel}
      </Button>

      {state.message ? (
        <p
          className={[
            "max-w-44 rounded-[var(--radius-sm)] border px-2.5 py-2 text-xs leading-snug",
            state.status === "success"
              ? "border-[rgba(92,117,82,0.24)] bg-[rgba(92,117,82,0.1)] text-[color:var(--color-success)]"
              : "border-[rgba(155,79,69,0.24)] bg-[rgba(155,79,69,0.1)] text-[color:var(--color-danger)]",
          ].join(" ")}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
