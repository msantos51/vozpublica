"use client";

import { FormEvent, useState } from "react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactApiResponse = {
  message?: string;
  reference?: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusReference, setStatusReference] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    // Atualiza apenas o campo alterado, mantendo o restante estado intacto.
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusReference("");
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as ContactApiResponse;
      setStatusReference(data.reference || "");

      if (!response.ok) {
        setStatusMessage(data.message || "Não foi possível enviar a sua mensagem.");
        return;
      }

      setStatusMessage(data.message || "Mensagem enviada com sucesso.");
      setIsSuccess(true);
      setFormData(initialFormData);
    } catch {
      setStatusMessage("Erro de ligação. Tente novamente dentro de alguns instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Contém apenas o formulário de contacto com o conteúdo centralizado. */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Cartão com formulário para envio de mensagens. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Título e instruções do formulário de contacto. */}
            <div>
              <p className="section-label">Formulário de contacto</p>
              <h1 className="mt-2 page-title">Envie a sua mensagem para a equipa.</h1>
              <p className="mt-2 text-sm text-justify text-slate-500">
                Partilhe dúvidas, sugestões ou solicitações e responderemos em breve.
              </p>
            </div>
            {/* Formulário com campos essenciais para contacto. */}
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Nome
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="name"
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  placeholder="Digite o seu nome"
                  required
                  type="text"
                  value={formData.name}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                E-mail
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="email"
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  placeholder="voce@email.com"
                  required
                  type="email"
                  value={formData.email}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Assunto
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="subject"
                  onChange={(event) => handleFieldChange("subject", event.target.value)}
                  placeholder="Ex.: parceria, suporte, imprensa"
                  required
                  type="text"
                  value={formData.subject}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Mensagem
                <textarea
                  className="soft-gradient-input min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="message"
                  onChange={(event) => handleFieldChange("message", event.target.value)}
                  placeholder="Escreva a sua mensagem"
                  required
                  value={formData.message}
                />
              </label>
              {/* Ações do formulário de contacto. */}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "A enviar..." : "Enviar mensagem"}
                </button>
                <p className="text-xs text-justify text-slate-500">Responderemos em até 2 dias úteis.</p>
              </div>
              {statusMessage ? (
                <div className="md:col-span-2 space-y-1">
                  <p className={`text-sm ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
                    {statusMessage}
                  </p>
                  {statusReference ? (
                    <p className="text-xs text-slate-500">
                      Referência da mensagem: <span className="font-semibold">{statusReference}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </form>
          </div>
        </article>
      </div>
    </section>
  );
}
