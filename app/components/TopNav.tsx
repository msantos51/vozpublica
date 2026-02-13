"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Sobre" },
  { href: "/votacoes", label: "Votações" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/contact", label: "Contacto" },
  { href: "/account", label: "Conta" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeItemLabel = useMemo(() => {
    const activeItem = navigationItems.find((item) => item.href === pathname);

    return activeItem?.label ?? "Menu";
  }, [pathname]);

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    if (isActive) {
      return "rounded-full bg-[color:var(--primary)] px-4 py-2 text-white transition";
    }

    return "rounded-full px-4 py-2 text-slate-500 transition hover:text-slate-700";
  };

  return (
    <nav className="relative w-full md:w-auto">
      {/* Botão visível apenas em mobile para abrir e fechar o menu sem ocupar espaço horizontal excessivo. */}
      <button
        aria-expanded={isMobileMenuOpen}
        aria-label="Abrir menu principal"
        className="flex w-full items-center justify-between rounded-full bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-slate-700 shadow-sm md:hidden"
        onClick={() => setIsMobileMenuOpen((previous) => !previous)}
        type="button"
      >
        <span>{activeItemLabel}</span>
        <span className="text-xs text-slate-500">{isMobileMenuOpen ? "Fechar" : "Menu"}</span>
      </button>

      {/* Lista de links com layout horizontal em desktop e painel vertical em mobile. */}
      <div
        className={`mt-2 flex flex-col gap-1 rounded-2xl bg-[color:var(--surface)] p-2 text-sm shadow-sm md:mt-0 md:flex-row md:items-center md:gap-2 md:rounded-full md:px-2 md:py-1 ${
          isMobileMenuOpen ? "flex" : "hidden md:flex"
        }`}
      >
        {navigationItems.map((item) => (
          // Usa âncora simples para garantir navegação mesmo quando o router cliente falha.
          <a
            key={item.href}
            className={getLinkClasses(item.href)}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
