import { BarChart3, Calculator, Package, ReceiptText, UserCircle, Users } from "lucide-react";

export const navItems = [
  { label: "Painel", href: "/painel", icon: BarChart3, emoji: "📊" },
  { label: "Produtos", href: "/produtos", icon: Package, emoji: "🕯️" },
  { label: "Precificar", href: "/produtos/novo", icon: Calculator, emoji: "🧮" },
  { label: "Clientes", href: "/clientes", icon: Users, emoji: "🤍" },
  { label: "Vendas", href: "/vendas", icon: ReceiptText, emoji: "🧾" },
  { label: "Perfil", href: "/perfil", icon: UserCircle, emoji: "🌿" },
];
