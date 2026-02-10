"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterForm = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
  password: string;
  confirmPassword: string;
};

type FeedbackState = {
  type: "success" | "error";
  message: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    email: "",
    city: "",
    interest: "",
    password: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    // Evita múltiplos envios enquanto a requisição está em andamento.
    if (isSubmitting) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFeedback({
        type: "error",
        message: "A confirmação da senha não coincide com a senha informada.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message: string };

      if (!response.ok) {
        setFeedback({ type: "error", message: data.message });
        return;
      }

      setFeedback({ type: "success", message: data.message });
      router.push("/login");
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Não foi possível criar a conta. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Contém o conteúdo centrado e agrupado em caixas. */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Cabeçalho introdutório da página de criação de conta. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="page-title">Conta</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Crie o seu perfil para acompanhar iniciativas e participar nas
              discussões da comunidade.
            </p>
          </div>
        </header>

        {/* Cartão principal com o formulário de criação de conta. */}
        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Texto de apoio com contexto sobre o cadastro. */}
            <div>
              <p className="section-label">Criar conta</p>
              <h2 className="mt-2 section-title">
                Participe da comunidade com o seu perfil.
              </h2>
              <p className="mt-2 text-sm text-justify text-slate-500">
                Preencha os dados abaixo para criar a sua conta e acompanhar as
                iniciativas locais.
              </p>
            </div>
            {/* Formulário com campos essenciais para cadastro. */}
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Nome completo
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="fullName"
                  placeholder="Digite o seu nome"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                E-mail
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="email"
                  placeholder="voce@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Senha
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="password"
                  placeholder="Crie uma senha segura"
                  type="password"
                  value={formData.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Confirmar senha
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="confirmPassword"
                  placeholder="Repita a senha"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cidade
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="city"
                  placeholder="Sua cidade"
                  type="text"
                  value={formData.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Área de interesse
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="interest"
                  placeholder="Ex.: educação, saúde, mobilidade"
                  type="text"
                  value={formData.interest}
                  onChange={(event) => handleChange("interest", event.target.value)}
                />
              </label>
              {/* Feedback após a criação de conta. */}
              {feedback && (
                <p
                  className={`rounded-2xl border px-4 py-3 text-sm text-justify md:col-span-2 ${
                    feedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
              {/* Ações do formulário para envio do cadastro. */}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95"
                  type="submit"
                >
                  {isSubmitting ? "A criar..." : "Criar conta"}
                </button>
                <Link className="text-sm font-semibold text-slate-500" href="/login">
                  Já tenho conta
                </Link>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>
  );
}
