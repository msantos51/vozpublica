export default function ContactPage() {
  return (
    <section className="space-y-8">
      {/* Cabeçalho com título e descrição de contato. */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-zinc-900">Contacto</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          Fale com a equipa da Voz Pública para parcerias, dúvidas ou suporte
          institucional.
        </p>
      </header>

      {/* Cartão com informações principais de contato. */}
      <article className="rounded-2xl border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Informações</h2>
        <div className="mt-4 space-y-3 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-900">Email:</span>{" "}
            contato@vozpublica.org
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Telefone:</span>{" "}
            +351 210 000 000
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Atendimento:</span>{" "}
            Segunda a sexta, 9h às 18h
          </p>
        </div>
      </article>

      {/* Cartão com formulário para envio de mensagens. */}
      <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <div className="flex flex-col gap-6">
          {/* Título e instruções do formulário de contato. */}
          <div>
            <p className="text-sm font-semibold text-[color:var(--primary)]">
              Formulário de contacto
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Envie a sua mensagem para a equipa.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Partilhe dúvidas, sugestões ou solicitações e responderemos em
              breve.
            </p>
          </div>
          {/* Formulário com campos essenciais para contato. */}
          <form className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Nome
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="name"
                placeholder="Digite o seu nome"
                type="text"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              E-mail
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="email"
                placeholder="voce@email.com"
                type="email"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Assunto
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="subject"
                placeholder="Ex.: parceria, suporte, imprensa"
                type="text"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Mensagem
              <textarea
                className="min-h-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
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
              <p className="text-xs text-slate-500">
                Responderemos em até 2 dias úteis.
              </p>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
}
