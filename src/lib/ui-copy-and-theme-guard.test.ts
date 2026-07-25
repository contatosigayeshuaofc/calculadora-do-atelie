import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const guardedFiles = [
  "src/components/customers/customer-form.tsx",
  "src/components/customers/customer-detail.tsx",
  "src/components/products/product-detail.tsx",
  "src/components/sales/sale-detail.tsx",
  "src/components/admin/admin-users-table.tsx",
  "src/components/admin/pilot-readiness-card.tsx",
  "src/app/admin/page.tsx",
  "src/app/error.tsx",
  "src/app/(auth)/redefinir-senha/page.tsx",
  "src/app/(app)/perfil/page.tsx",
  "src/app/(app)/produtos/novo/page.tsx",
  "src/app/(app)/produtos/[productId]/editar/page.tsx",
  "src/components/customers/customer-list.tsx",
  "src/components/products/product-list.tsx",
  "src/components/products/product-form.tsx",
  "src/components/sales/sale-list.tsx",
  "src/components/sales/sale-form.tsx",
  "src/components/sales/sale-edit-form.tsx",
  "src/components/ui/dialog.tsx",
];

const legacyThemeSnippets = [
  "bg-white",
  "text-[color:var(--color-warm-graphite)]",
  "border-[color:var(--color-clay-beige)]",
  "shadow-[var(--shadow-soft)]",
];

const legacyVisibleCopy = [
  "Cliente nao informado",
  "Nao informado",
  "Ultima compra",
  "Aniversario",
  "Observacoes",
  "historico",
  "aparecera",
  "Custo unitario",
  "Preco minimo",
  "Unitario",
  "aprovacao",
  "analise",
  "usuario",
  "E-mail nao encontrado",
  "Liberacao",
  "Preparacao",
  " ve o painel",
];

describe("copy and dark member-area theme guard", () => {
  it.each(guardedFiles)("keeps %s aligned with the current app identity", (file) => {
    const source = readFileSync(join(process.cwd(), file), "utf8");

    for (const snippet of legacyThemeSnippets) {
      expect(source).not.toContain(snippet);
    }

    for (const copy of legacyVisibleCopy) {
      expect(source).not.toContain(copy);
    }
  });
});
