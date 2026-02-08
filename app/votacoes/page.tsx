export default function VotacoesPage() {
  const votingHighlights = [
    {
      title: "Orçamento participativo 2024",
      description:
        "Defina as prioridades de investimento para bairros, mobilidade urbana e espaços públicos.",
      status: "Aberta",
      deadline: "Prazo: 30 de junho",
    },
    {
      title: "Plano municipal de sustentabilidade",
      description:
        "Contribua com sugestões para reduzir emissões e ampliar a reciclagem na cidade.",
      status: "Em consulta",
      deadline: "Prazo: 18 de julho",
    },
    {
      title: "Programa de juventude e emprego",
      description:
        "Vote em propostas que fortalecem formação profissional e oportunidades locais.",
      status: "A iniciar",
      deadline: "Abre em 5 dias",
    },
  ];

  const votingSteps = [
    {
      title: "1. Informar",
      description:
        "Analise os documentos e dados disponibilizados antes de escolher uma opção.",
    },
    {
      title: "2. Participar",
      description:
        "Registe o seu voto com segurança e acompanhe o impacto em tempo real.",
    },
    {
      title: "3. Acompanhar",
      description:
        "Receba atualizações sobre a implementação das decisões votadas.",
    },
  ];

  return (
    <section className="space-y-10">
      {/* Área principal com largura máxima e espaçamento entre blocos. */}
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Cabeçalho com resumo da experiência de votações. */}
        <header className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Participação ativa
            </p>
            <h1 className="text-3xl font-semibold text-zinc-900">Votações</h1>
            <p className="text-base leading-7 text-justify text-zinc-600">
              Acompanhe as consultas públicas em aberto, participe nas decisões
              locais e veja como a sua escolha impacta o planeamento urbano.
            </p>
          </div>
        </header>

        {/* Destaques das votações em cartões com status. */}
        <div className="grid gap-6 lg:grid-cols-3">
          {votingHighlights.map((voting) => (
            <article key={voting.title} className="card">
              {/* Camada translúcida para realçar o conteúdo. */}
              <div className="bg" />
              {/* Efeito visual animado ao fundo do cartão. */}
              <div className="blob" />
              {/* Conteúdo textual principal do cartão. */}
              <div className="card-content space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {voting.title}
                  </h2>
                  <p className="text-sm leading-6 text-justify text-zinc-600">
                    {voting.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {voting.status}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {voting.deadline}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Guia rápido de como participar. */}
        <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-[0_15px_35px_rgba(249,115,22,0.12)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Como participar
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {votingSteps.map((step) => (
                <div key={step.title} className="space-y-2">
                  <h3 className="text-base font-semibold text-orange-700">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-justify text-zinc-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
