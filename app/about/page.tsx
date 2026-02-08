export default function AboutPage() {
  return (
    <section className="space-y-10">
      {/* Contém o conteúdo centrado e agrupado em caixas. */}
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Introdução sobre a missão do projeto dentro de um cartão. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-zinc-900">
              Sobre a Voz Pública
            </h1>
            <p className="text-base leading-7 text-justify text-zinc-600">
              A Voz Pública é uma plataforma que aproxima cidadãos e instituições
              públicas através de informação acessível, consultas abertas e dados
              atualizados sobre projetos locais.
            </p>
          </div>
        </header>

        {/* Lista com pilares que explicam o funcionamento da plataforma. */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:gap-10">
          <article className="card">
            {/* Camada de fundo translúcida para realçar o conteúdo. */}
            <div className="bg" />
            {/* Elemento animado com gradiente que percorre o cartão. */}
            <div className="blob" />
            {/* Conteúdo textual acima das camadas decorativas. */}
            <div className="card-content">
              {/* Pilar de transparência. */}
              <h2 className="text-lg font-semibold text-zinc-900">
                Transparência
              </h2>
              <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                Reunimos relatórios, calendário de obras e indicadores relevantes
                para que qualquer pessoa acompanhe as decisões públicas.
              </p>
            </div>
          </article>
          <article className="card">
            {/* Camada de fundo translúcida para realçar o conteúdo. */}
            <div className="bg" />
            {/* Elemento animado com gradiente que percorre o cartão. */}
            <div className="blob" />
            {/* Conteúdo textual acima das camadas decorativas. */}
            <div className="card-content">
              {/* Pilar de participação. */}
              <h2 className="text-lg font-semibold text-zinc-900">
                Participação
              </h2>
              <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                Abrimos canais de consulta e feedback para transformar ideias em
                melhorias reais para a comunidade.
              </p>
            </div>
          </article>
          <article className="card">
            {/* Camada de fundo translúcida para realçar o conteúdo. */}
            <div className="bg" />
            {/* Elemento animado com gradiente que percorre o cartão. */}
            <div className="blob" />
            {/* Conteúdo textual acima das camadas decorativas. */}
            <div className="card-content">
              {/* Pilar de colaboração institucional. */}
              <h2 className="text-lg font-semibold text-zinc-900">
                Colaboração
              </h2>
              <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                Trabalhamos com órgãos locais para garantir que as respostas aos
                cidadãos sejam rápidas e fundamentadas em dados.
              </p>
            </div>
          </article>
          <article className="card">
            {/* Camada de fundo translúcida para realçar o conteúdo. */}
            <div className="bg" />
            {/* Elemento animado com gradiente que percorre o cartão. */}
            <div className="blob" />
            {/* Conteúdo textual acima das camadas decorativas. */}
            <div className="card-content">
              {/* Pilar de acessibilidade digital. */}
              <h2 className="text-lg font-semibold text-zinc-900">
                Acessibilidade
              </h2>
              <p className="mt-3 text-sm leading-6 text-justify text-zinc-600">
                A experiência foi desenhada para ser simples, responsiva e fácil
                de usar em qualquer dispositivo.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
