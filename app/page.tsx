import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      {/* Cartão com resumo geral e ação principal. */}
      <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <div className="flex flex-col gap-6">
          {/* Título principal da página com destaque de marca. */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[color:var(--primary)]">
                Resumo semanal
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Participação cidadã com dados claros e acessíveis.
              </h1>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-xl text-[color:var(--primary)] md:flex">
              ★
            </div>
          </div>
          {/* Texto complementar sobre o painel. */}
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Acompanhe indicadores de transparência, compromissos públicos e
            sugestões da comunidade em um painel elegante e rápido.
          </p>
          {/* Área de ações e cartões auxiliares. */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              href="/about"
            >
              Conheça o projeto
            </Link>
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300">
              Explorar iniciativas
            </button>
          </div>
        </div>
      </article>
      {/* Seção com formulário para criação de conta. */}
      <article className="mt-10 rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <div className="flex flex-col gap-6">
          {/* Título e descrição do formulário de cadastro. */}
          <div>
            <p className="text-sm font-semibold text-[color:var(--primary)]">
              Criar conta
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Participe da comunidade com o seu perfil.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Preencha os dados abaixo para criar a sua conta e acompanhar as
              iniciativas locais.
            </p>
          </div>
          {/* Formulário com campos essenciais para cadastro. */}
          <form className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Nome completo
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="fullName"
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
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Senha
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="password"
                placeholder="Crie uma senha segura"
                type="password"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Cidade
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="city"
                placeholder="Sua cidade"
                type="text"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Área de interesse
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--primary)] focus:bg-white"
                name="interest"
                placeholder="Ex.: educação, saúde, mobilidade"
                type="text"
              />
            </label>
            {/* Ações do formulário para envio do cadastro. */}
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <button
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                type="submit"
              >
                Criar conta
              </button>
              <p className="text-xs text-slate-500">
                Ao criar uma conta, você concorda com os termos de uso.
              </p>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
}
