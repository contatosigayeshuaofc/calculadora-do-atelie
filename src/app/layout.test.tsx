import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("shows the support email at the end of the page", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Conteudo</main>
      </RootLayout>,
    );

    expect(markup).toContain("suporte@ateliearomatico.site");
    expect(markup).toContain('href="mailto:suporte@ateliearomatico.site"');
    expect(markup).toMatch(/Conteudo[\s\S]*suporte@ateliearomatico\.site/);
  });
});
