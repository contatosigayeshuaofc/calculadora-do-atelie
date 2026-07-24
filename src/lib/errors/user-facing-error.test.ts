import { describe, expect, it } from "vitest";
import {
  getUserFacingErrorMessage,
  technicalErrorPattern,
} from "./user-facing-error";

describe("getUserFacingErrorMessage", () => {
  it("keeps friendly validation messages visible", () => {
    expect(getUserFacingErrorMessage(new Error("Informe o nome do produto."))).toBe(
      "Informe o nome do produto.",
    );
  });

  it("hides technical database and environment details from customers", () => {
    const messages = [
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      'duplicate key value violates unique constraint "customers_user_id_name_key"',
      "permission denied for table profiles",
      "invalid input syntax for type uuid: abc",
      "Could not find the public.create_sale_with_items function in the schema cache",
    ];

    for (const message of messages) {
      const friendly = getUserFacingErrorMessage(new Error(message));

      expect(friendly).toBe("Nao foi possivel concluir a acao. Tente novamente.");
      expect(friendly).not.toMatch(technicalErrorPattern);
    }
  });
});
