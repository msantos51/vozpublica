"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginResponse = {
  message: string;
  user?: {
    fullName: string;
    email: string;
    city: string | null;
    interest: string | null;
  };
};

const sessionStorageKey = "vp_session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    // Evita múltiplos envios enquanto a requisição está em andamento.
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setFeedback(data.message);
        return;
      }

      if (data.user?.email) {
        localStorage.setItem(sessionStorageKey, data.user.email);
      }

      router.push("/dashboard");
    } catch (error) {
      setFeedback("Não foi possível iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Contém o conteúdo centrado e agrupado em caixas. */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Cabeçalho introdutório da página de login. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Aceda à sua conta para gerir o perfil e acompanhar as iniciativas.
            </p>
          </div>
        </header>

        {/* Cartão com o formulário de autenticação. */}
        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Texto de apoio com instruções rápidas. */}
            <div>
              <p className="text-sm font-semibold text-[color:var(--primary)]">
                Entrar
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Bem-vindo de volta.
              </h2>
              <p className="mt-2 text-sm text-justify text-slate-500">
                Utilize o e-mail e a senha registados para continuar.
              </p>
            </div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                E-mail
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="email"
                  placeholder="voce@email.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Senha
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="password"
                  placeholder="Digite a sua senha"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {/* Feedback visível em caso de erro ou orientação. */}
              {feedback && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-justify text-amber-700 md:col-span-2">
                  {feedback}
                </p>
              )}
              {/* Ações principais do formulário. */}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                  type="submit"
                >
                  {isSubmitting ? "A entrar..." : "Entrar"}
                </button>
                <Link className="text-sm font-semibold text-slate-500" href="/account">
                  Criar conta
                </Link>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>
  );
}
