import { expect, test } from "@playwright/test";

const protectedRoutes = ["/painel", "/produtos", "/clientes", "/vendas", "/configuracoes"];

test.describe("MVP local smoke", () => {
  test("shows the sign-in page and captures a visual checkpoint", async ({ page }, testInfo) => {
    await page.goto("/entrar");

    await expect(page.getByRole("heading", { name: "Calculadora do Atelie" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Entre no seu atelie" })).toBeVisible();
    await expect(page.getByText("Configure NEXT_PUBLIC_SUPABASE_URL")).toBeVisible();
    await expect(page.getByRole("link", { name: "suporte@ateliearomatico.site" })).toHaveAttribute(
      "href",
      "mailto:suporte@ateliearomatico.site",
    );

    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath(`entrar-${testInfo.project.name}.png`),
    });
  });

  for (const route of protectedRoutes) {
    test(`protects ${route} without a configured session`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/entrar/);
      await expect(page.getByText("Configure NEXT_PUBLIC_SUPABASE_URL")).toBeVisible();
    });
  }

  test("keeps the admin page hidden from visitors", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/entrar/);
    await expect(page.getByText("Configure NEXT_PUBLIC_SUPABASE_URL")).toBeVisible();
  });
});
