export default function AboutPage() {
  return (
    <section className="space-y-10">
      {/* Introdução sobre a missão do projeto. */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-zinc-900">
          Sobre a Voz Pública
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          A Voz Pública é uma plataforma que aproxima cidadãos e instituições
          públicas através de informação acessível, consultas abertas e dados
          atualizados sobre projetos locais.
        </p>
      </header>

      {/* Lista com pilares que explicam o funcionamento da plataforma. */}
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Pilar de transparência. */}
          <h2 className="text-lg font-semibold text-zinc-900">Transparência</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Reunimos relatórios, calendário de obras e indicadores relevantes
            para que qualquer pessoa acompanhe as decisões públicas.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Pilar de participação. */}
          <h2 className="text-lg font-semibold text-zinc-900">Participação</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Abrimos canais de consulta e feedback para transformar ideias em
            melhorias reais para a comunidade.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Pilar de colaboração institucional. */}
          <h2 className="text-lg font-semibold text-zinc-900">Colaboração</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Trabalhamos com órgãos locais para garantir que as respostas aos
            cidadãos sejam rápidas e fundamentadas em dados.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Pilar de acessibilidade digital. */}
          <h2 className="text-lg font-semibold text-zinc-900">Acessibilidade</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            A experiência foi desenhada para ser simples, responsiva e fácil de
            usar em qualquer dispositivo.
          </p>
        </article>
      </div>
    </section>
  );
}
