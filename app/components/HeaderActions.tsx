"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserProfile = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
  password: string;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";

export default function HeaderActions() {
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);

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

    const parsedUser = JSON.parse(storedUser) as UserProfile;

    if (parsedUser.email !== storedSession) {
      setSessionUser(null);
      return;
    }

    setSessionUser(parsedUser);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Botão de login exibido apenas quando não há sessão ativa. */}
      {!sessionUser && (
        <Link
          className="button-size-login border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
          href="/login"
        >
          Login
        </Link>
      )}
      {/* Perfil exibido apenas quando existe sessão ativa. */}
      {sessionUser && (
        <Link
          className="flex items-center gap-3 rounded-full bg-[color:var(--surface)] px-4 py-2 shadow-sm"
          href="/dashboard"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[color:var(--primary)] text-[10px] font-semibold text-[color:var(--primary)]">
            {profileInitials}
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-900">{sessionUser.fullName}</p>
          </div>
        </Link>
      )}
    </div>
  );
}
