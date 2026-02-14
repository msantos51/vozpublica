"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoginResponse = {
  message: string;
  user?: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    birthDate: string | null;
    city: string | null;
    gender: string | null;
    educationLevel: string | null;
    profileCompleted: boolean;
    isAdmin: boolean;
  };
};

type SessionUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  birthDate: string;
  city: string;
  gender: string;
  educationLevel: string;
  profileCompleted: boolean;
  isAdmin: boolean;
};

const userStorageKey = "vp_user";
const sessionStorageKey = "vp_session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlParameters = new URLSearchParams(window.location.search);

    if (urlParameters.get("registered") === "1") {
      // Exibe orientação após registo para o utilizador confirmar o e-mail.
      setFeedback("Conta criada com sucesso. Verifique o e-mail para confirmar a conta.");
    }

    if (urlParameters.get("confirmed") === "1") {
      // Mostra confirmação quando o utilizador valida a conta pelo link enviado.
      setFeedback("Conta confirmada com sucesso. Já pode iniciar sessão.");
    }

    if (urlParameters.get("confirmed") === "0") {
      // Informa token inválido ou expirado no fluxo de confirmação de conta.
      setFeedback("Link de confirmação inválido ou expirado.");
    }

    // Mantém o utilizador autenticado ao regressar ao ecrã de login.
    const storedSession = localStorage.getItem(sessionStorageKey);
    const storedUser = localStorage.getItem(userStorageKey);

    if (storedSession && storedUser) {
      router.push("/dashboard");
    }
  }, [router]);

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
        const normalizedSessionUser: SessionUser = {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          fullName: data.user.fullName,
          email: data.user.email,
          birthDate: data.user.birthDate ?? "",
          city: data.user.city ?? "",
          gender: data.user.gender ?? "",
          educationLevel: data.user.educationLevel ?? "",
          profileCompleted: data.user.profileCompleted,
          isAdmin: data.user.isAdmin,
        };

        localStorage.setItem(sessionStorageKey, normalizedSessionUser.email);
        localStorage.setItem(userStorageKey, JSON.stringify(normalizedSessionUser));
      }

      router.push("/dashboard");
    } catch {
      setFeedback("Não foi possível iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="page-title">Login</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Aceda à sua conta para gerir o perfil e acompanhar as iniciativas.
            </p>
          </div>
        </header>

        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="section-label">Entrar</p>
              <h2 className="mt-2 section-title">Bem-vindo de volta.</h2>
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
              {feedback && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-justify text-amber-700 md:col-span-2">
                  {feedback}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95"
                  type="submit"
                >
                  {isSubmitting ? "A entrar..." : "Entrar"}
                </button>
                <Link className="text-sm font-semibold text-slate-500" href="/account">
                  Criar conta
                </Link>
                <Link className="text-sm font-semibold text-slate-500" href="/forgot-password">
                  Esqueci-me da password
                </Link>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>
  );
}
