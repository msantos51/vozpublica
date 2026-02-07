export default function AccountPage() {
  return (
    <section className="space-y-8">
      {/* Cabeçalho introdutório da página de criação de conta. */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Conta</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-500">
          Crie o seu perfil para acompanhar iniciativas e participar nas
          discussões da comunidade.
        </p>
      </header>

      {/* Cartão principal com o formulário de criação de conta. */}
      <article className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
        <div className="flex flex-col gap-6">
          {/* Texto de apoio com contexto sobre o cadastro. */}
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
