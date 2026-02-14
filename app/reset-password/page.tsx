"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ResetResponse = {
  message: string;
};

export default function ResetPasswordPage() {
  const searchParameters = useSearchParams();
  const token = searchParameters.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Evita dupla submissão enquanto o pedido de reset está em processamento.
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = (await response.json()) as ResetResponse;
      setFeedback(data.message);
    } catch {
      setFeedback("Não foi possível redefinir a password. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="page-title">Definir nova password</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Introduza a nova password para concluir a recuperação da conta.
            </p>
          </div>
        </header>

        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Nova password
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Confirmar nova password
              <input
                className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>

            {feedback && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {feedback}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95"
                type="submit"
              >
                {isSubmitting ? "A atualizar..." : "Atualizar password"}
              </button>
              <Link className="text-sm font-semibold text-slate-500" href="/login">
                Ir para login
              </Link>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
