import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora do Ateliê",
  description: "Calcule custos, preços e resultados do seu ateliê artesanal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <footer className="px-4 pb-6 pt-4 text-center text-xs leading-5 text-[color:var(--color-text-muted)]">
          Precisa de ajuda?{" "}
          <a className="font-semibold text-[color:var(--color-gold)] underline-offset-4 hover:underline" href="mailto:suporte@ateliearomatico.site">
            suporte@ateliearomatico.site
          </a>
        </footer>
      </body>
    </html>
  );
}
