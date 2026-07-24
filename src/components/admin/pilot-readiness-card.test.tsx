import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PilotReadinessCard } from "./pilot-readiness-card";

describe("PilotReadinessCard", () => {
  it("shows the admin a clear pilot checklist without exposing secrets", () => {
    render(<PilotReadinessCard />);

    expect(screen.getByRole("heading", { name: "Status do piloto" })).toBeInTheDocument();
    expect(screen.getByText("Configurar Supabase real")).toBeInTheDocument();
    expect(screen.getByText("Criar administrador real")).toBeInTheDocument();
    expect(screen.getByText("Testar cliente real")).toBeInTheDocument();
    expect(screen.getByText("Publicar no dominio final")).toBeInTheDocument();
    expect(screen.getByText(/Rode a checagem final antes de vender o acesso/)).toBeInTheDocument();

    expect(screen.queryByText(/SUPABASE_SERVICE_ROLE_KEY/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ADMIN_BOOTSTRAP_PASSWORD/)).not.toBeInTheDocument();
  });
});
