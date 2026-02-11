"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
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
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
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

      setFeedback({ type: "success", message: "Registo efetuado com sucesso." });
      router.push("/login?registered=1");
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
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h1 className="page-title">Conta</h1>
            <p className="text-base leading-7 text-justify text-slate-500">
              Crie a sua conta com os dados essenciais. Os dados estatísticos serão pedidos apenas no primeiro login.
            </p>
          </div>
        </header>

        <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="section-label">Criar conta</p>
              <h2 className="mt-2 section-title">Registo rápido e seguro.</h2>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Primeiro nome
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="firstName"
                  placeholder="Digite o seu primeiro nome"
                  type="text"
                  value={formData.firstName}
                  onChange={(event) => handleChange("firstName", event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Último nome
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="lastName"
                  placeholder="Digite o seu último nome"
                  type="text"
                  value={formData.lastName}
                  onChange={(event) => handleChange("lastName", event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
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

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                NIF
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="nationalId"
                  placeholder="Digite o seu NIF (9 dígitos)"
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  value={formData.nationalId}
                  onChange={(event) => handleChange("nationalId", event.target.value)}
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
