"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Conta" },
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
    <nav className="hidden items-center gap-2 rounded-full bg-[color:var(--surface)] px-2 py-1 text-sm shadow-sm md:flex">
      {/* Lista de links principais com destaque na página ativa. */}
      {navigationItems.map((item) => (
        <Link key={item.href} className={getLinkClasses(item.href)} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
