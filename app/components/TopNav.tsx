"use client";

import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Sobre" },
  { href: "/votacoes", label: "Votações" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/contact", label: "Contacto" },
  { href: "/account", label: "Conta" },
  { href: "/admin/polls", label: "Admin" },
];

export default function TopNav() {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    if (isActive) {
      return "rounded-full bg-[color:var(--primary)] px-4 py-2 text-white transition";
    }

    return "rounded-full px-4 py-2 text-slate-500 transition hover:text-slate-700";
  };

  return (
    <nav className="flex w-full items-center gap-2 overflow-x-auto rounded-full bg-[color:var(--surface)] px-2 py-1 text-sm shadow-sm md:w-auto md:overflow-visible">
      {/* Lista de links principais com destaque na página ativa. */}
      {navigationItems.map((item) => (
        // Usa âncora simples para garantir navegação mesmo quando o router cliente falha.
        <a key={item.href} className={getLinkClasses(item.href)} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
