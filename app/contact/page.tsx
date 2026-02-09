export default function ContactPage() {
  return (
    <section className="space-y-8">
      {/* Contém apenas o formulário de contacto com o conteúdo centralizado. */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Cartão com formulário para envio de mensagens. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Título e instruções do formulário de contato. */}
            <div>
              <p className="section-label">Formulário de contacto</p>
              <h1 className="mt-2 page-title">
                Envie a sua mensagem para a equipa.
              </h1>
              <p className="mt-2 text-sm text-justify text-slate-500">
                Partilhe dúvidas, sugestões ou solicitações e responderemos em
                breve.
              </p>
            </div>
            {/* Formulário com campos essenciais para contato. */}
            <form className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Nome
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="name"
                  placeholder="Digite o seu nome"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                E-mail
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="email"
                  placeholder="voce@email.com"
                  type="email"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Assunto
                <input
                  className="soft-gradient-input rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="subject"
                  placeholder="Ex.: parceria, suporte, imprensa"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Mensagem
                <textarea
                  className="soft-gradient-input min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)]"
                  name="message"
                  placeholder="Escreva a sua mensagem"
                />
              </label>
              {/* Ações do formulário de contato. */}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                  type="submit"
                >
                  Enviar mensagem
                </button>
                <p className="text-xs text-justify text-slate-500">
                  Responderemos em até 2 dias úteis.
                </p>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>
  );
}
