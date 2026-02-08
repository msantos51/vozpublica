import Link from "next/link";

export default function EnterprisePage() {
  return (
    <section className="space-y-12">
      {/* Contém o conteúdo centrado e agrupado em caixas. */}
      <div className="mx-auto w-full max-w-5xl space-y-12">
        {/* Hero com proposta de valor e chamadas para ação. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[color:var(--primary)]">
                Página Enterprise
              </p>
              <h1 className="text-3xl font-semibold text-zinc-900">
                Insights reais a partir da opinião das pessoas.
              </h1>
              <p className="text-base leading-7 text-justify text-zinc-600">
                A Voz Pública ajuda marcas a compreender melhor o que as pessoas
                pensam, através de estudos de opinião rápidos, anónimos e baseados
                em dados reais.
              </p>
            </div>
            {/* Ações principais da página. */}
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                href="/contact"
              >
                Falar connosco
              </Link>
              <button
                className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300"
                type="button"
              >
                Ver exemplos de estudos
              </button>
            </div>
          </div>
        </header>

        {/* Segmentos que costumam trabalhar connosco. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-zinc-900">
                Quem trabalha connosco
              </h2>
              <p className="text-sm leading-6 text-justify text-zinc-600">
                Ajudamos equipas que procuram decisões baseadas em dados, com
                rapidez e credibilidade.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Marcas e anunciantes",
                "Agências de marketing e comunicação",
                "Media e publishers",
                "Startups e scale-ups",
                "Equipas de research, insights ou produto",
              ].map((segment) => (
                <div
                  key={segment}
                  className="rounded-2xl bg-[color:var(--surface)] p-5 text-sm text-justify text-zinc-700 shadow-[0_10px_30px_rgba(31,41,55,0.08)]"
                >
                  {segment}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços e entregáveis principais. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">O que oferecemos</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Serviço de estudos personalizados. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Estudos de opinião personalizados
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Criamos e lançamos votações adaptadas ao seu objetivo, garantindo
                  anonimato, neutralidade e recolha de dados fiável.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Serviço de segmentação detalhada. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Segmentação de público
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Resultados analisados por variáveis como idade, género,
                  localização, interesses e comportamento de participação.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Serviço de análise e interpretação. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Análise e interpretação
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Não entregamos apenas números. Entregamos leitura, contexto e
                  conclusões acionáveis.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Serviço de relatórios e dashboards. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Relatórios e dashboards
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Resultados apresentados em relatórios claros ou dashboards
                  interativos, prontos para decisão.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Chamada final para ação. */}
        <section className="rounded-[32px] bg-slate-900 px-8 py-10 text-white shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Vamos falar?</h2>
              <p className="max-w-xl text-sm leading-6 text-justify text-slate-200">
                Se pretende realizar um estudo de opinião ou explorar insights
                sobre um público específico, fale connosco.
              </p>
            </div>
            {/* Ações finais para contacto. */}
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-95"
                type="button"
              >
                Entrar em contacto
              </button>
              <button
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                type="button"
              >
                Agendar conversa
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
