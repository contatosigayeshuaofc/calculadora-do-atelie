import { BarChart3, Calculator, Package, ReceiptText, Settings, Users } from "lucide-react";

export const navItems = [
  { label: "Painel", href: "/painel", icon: BarChart3 },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Precificar", href: "/produtos/novo", icon: Calculator },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Vendas", href: "/vendas", icon: ReceiptText },
  { label: "Ajustes", href: "/configuracoes", icon: Settings },
];
