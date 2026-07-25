import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const protectedRoutes = ["/painel", "/produtos", "/clientes", "/vendas", "/configuracoes"];
function gotoApp(page: Page, route: string) {
  return page.goto(route, { waitUntil: "domcontentloaded" });
}

test.describe("MVP local smoke", () => {
  test("shows the sign-in page and captures a visual checkpoint", async ({ page }, testInfo) => {
    await gotoApp(page, "/entrar");

    await expect(page.getByRole("heading", { name: "Calculadora do Ateliê" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Entre no seu ateliê" })).toBeVisible();
    await expect(page.getByLabel("E-mail").first()).toBeVisible();
    await expect(page.getByLabel("Senha").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

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
      await gotoApp(page, route);

      await expect(page).toHaveURL(/\/entrar/);
      await expect(page.getByRole("heading", { name: "Entre no seu ateliê" })).toBeVisible();
    });
  }

  test("keeps the admin page hidden from visitors", async ({ page }) => {
    await gotoApp(page, "/admin");

    await expect(page).toHaveURL(/\/entrar/);
    await expect(page.getByRole("heading", { name: "Entre no seu ateliê" })).toBeVisible();
  });
});
