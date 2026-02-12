"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  fullName: string;
  email: string;
  isAdmin?: boolean;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";

export default function HeaderActions() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const profileInitials = useMemo(() => {
    if (!sessionUser?.fullName) {
      return "VP";
    }

    const initials = sessionUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");

    return initials || "VP";
  }, [sessionUser]);

  useEffect(() => {
    // Lê os dados gravados no navegador para determinar se há sessão ativa.
    const storedSession = localStorage.getItem(sessionStorageKey);
    const storedUser = localStorage.getItem(userStorageKey);

    if (!storedSession || !storedUser) {
      setSessionUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as SessionUser;

      if (parsedUser.email !== storedSession) {
        setSessionUser(null);
        return;
      }

      setSessionUser(parsedUser);
    } catch (error) {
      setSessionUser(null);
    }
  }, []);

  return (
    <div className="flex w-full items-center justify-start gap-4 md:w-auto md:justify-end">
      {!sessionUser && (
        <Link
          className="button-size-login border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
          href="/login"
        >
          Login
        </Link>
      )}
      {sessionUser && (
        <Link
          className="flex max-w-full items-center gap-3 rounded-full bg-[color:var(--surface)] px-4 py-2 shadow-sm"
          href="/dashboard"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-[color:var(--primary)] text-[10px] font-semibold text-[color:var(--primary)]">
            {profileInitials}
          </div>
          {/* Limita o bloco textual no mobile para impedir que nomes longos quebrem o cabeçalho. */}
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium text-slate-900">{sessionUser.fullName}</p>
            {sessionUser.isAdmin && <p className="text-xs text-[color:var(--primary)]">Admin</p>}
          </div>
        </Link>
      )}
    </div>
  );
}
