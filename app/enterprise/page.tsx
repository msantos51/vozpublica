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
              <button
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                type="button"
              >
                Falar connosco
              </button>
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

        {/* Processo resumido em quatro passos. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Como funciona</h2>
            <ol className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Definição do objetivo",
                  description:
                    "Percebemos o que a marca quer testar ou compreender.",
                },
                {
                  title: "Desenho do estudo",
                  description:
                    "Criamos as perguntas e a lógica do estudo, minimizando viés.",
                },
                {
                  title: "Lançamento e recolha",
                  description:
                    "A poll é lançada na plataforma, integrada em contexto real de participação.",
                },
                {
                  title: "Entrega de insights",
                  description:
                    "Resultados analisados, interpretados e apresentados de forma clara.",
                },
              ].map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Passo {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Diferenciais de credibilidade. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Porque funciona</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Diferencial de dados reais. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Dados reais, não painéis forçados
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  As pessoas participam porque querem, não porque foram pagas.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Diferencial de menos viés. */}
                <h3 className="text-lg font-semibold text-zinc-900">Menos viés</h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  As marcas não são expostas ao público durante a recolha.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Diferencial de rapidez. */}
                <h3 className="text-lg font-semibold text-zinc-900">Rapidez</h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Estudos podem ser lançados e analisados em poucos dias.
                </p>
              </article>
              <article className="rounded-2xl bg-[color:var(--surface)] p-6 shadow-[0_10px_30px_rgba(31,41,55,0.08)]">
                {/* Diferencial de transparência. */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Transparência
                </h3>
                <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                  Metodologia clara e dados anónimos, em conformidade com RGPD.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Exemplos de utilização. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Casos de uso</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Testar perceção de um conceito ou ideia",
                "Avaliar reação a um produto ou campanha",
                "Medir tendências de consumo ou opinião",
                "Comparar públicos ou segmentos",
                "Apoiar decisões estratégicas",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[color:var(--surface)] p-5 text-sm text-justify text-zinc-700 shadow-[0_10px_30px_rgba(31,41,55,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Informação de ética e privacidade. */}
        <section className="rounded-[32px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Ética &amp; privacidade
            </h2>
            <p className="text-sm leading-6 text-justify text-zinc-600">
              Todos os estudos respeitam o RGPD. Os dados são anónimos, agregados
              e utilizados exclusivamente para fins de análise.
            </p>
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
