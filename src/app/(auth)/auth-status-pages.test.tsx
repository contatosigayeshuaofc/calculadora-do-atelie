import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SuspendedAccessPage from "./acesso-suspenso/page";
import WaitingAccessPage from "./aguardando-liberacao/page";
import ForgotPasswordPage from "./recuperar-senha/page";

describe("auth status pages", () => {
  it("shows accented Portuguese copy on the waiting access page", () => {
    render(<WaitingAccessPage />);

    expect(screen.getByRole("heading", { name: "Aguardando liberação" })).toBeInTheDocument();
    expect(
      screen.getByText("Sua conta foi criada com sucesso. Em até 24horas será liberada automaticamente."),
    ).toBeInTheDocument();
    expect(screen.getByText("suporte@ateliearomatico.site")).toBeInTheDocument();
  });

  it("shows accented Portuguese copy on support and recovery pages", () => {
    render(
      <>
        <SuspendedAccessPage />
        <ForgotPasswordPage />
      </>,
    );

    expect(
      screen.getByText(
        "Seu acesso não está ativo no momento. Entre em contato pelo canal de suporte da compra para regularizar.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Recuperação")).toBeInTheDocument();
  });
});
