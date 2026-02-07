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
    </section>
  );
}
