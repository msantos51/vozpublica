import Link from "next/link";

type StackedChartCard = {
  type: "stacked";
  title: string;
  primaryLabel: string;
  primaryValue: number;
  secondaryLabel: string;
  secondaryValue: number;
};

type BarChartCard = {
  type: "bar";
  title: string;
  bars: Array<{ label: string; value: number; color: string }>;
};

type PieChartCard = {
  type: "pie";
  title: string;
  segments: Array<{ label: string; value: number; color: string }>;
};

type ChartCard = StackedChartCard | BarChartCard | PieChartCard;

export default function HomePage() {
  const chartCards: ChartCard[] = [
    {
      type: "stacked",
      title: "Habitação acessível",
      primaryLabel: "A favor",
      primaryValue: 62,
      secondaryLabel: "Contra",
      secondaryValue: 38,
    },
    {
      type: "bar",
      title: "Transporte público gratuito",
      bars: [
        { label: "Sim", value: 54, color: "bg-[#fea076]" },
        { label: "Não", value: 31, color: "bg-[#b67ee8]" },
        { label: "Indecisos", value: 15, color: "bg-slate-300" },
      ],
    },
    {
      type: "pie",
      title: "Mais espaços verdes",
      segments: [
        { label: "Prioridade alta", value: 71, color: "#b67ee8" },
        { label: "Prioridade média", value: 19, color: "#fea076" },
        { label: "Outros temas", value: 10, color: "#cbd5f5" },
      ],
    },
  ];

  return (
    <section>
      {/* Contém a secção principal centrada com largura confortável para o texto. */}
      <div className="mx-auto w-full max-w-5xl">
        {/* Cartão com resumo geral e ação principal. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Título principal da página com destaque de marca. */}
            <div>
              <p className="text-sm font-semibold text-[color:var(--primary)]">
                <span className="block">Dá voz ao que pensas.</span>
                <span className="block">Vê o que os outros pensam.</span>
              </p>
              <h1 className="mt-2 text-[1.7rem] font-semibold text-justify text-slate-900">
                <span className="block">
                  A <span className="text-[#b67ee8]">Voz Pública</span> é um
                  espaço aberto.
                </span>
                <span className="block">
                  Aqui, qualquer pessoa pode participar, votar e acompanhar a
                  opinião coletiva sobre os temas que realmente importam.
                </span>
              </h1>
            </div>
            {/* Texto complementar sobre o painel. */}
            <p className="text-sm leading-6 text-justify text-slate-500">
              Escolhe os temas que queres acompanhar, partilha a tua opinião e
              ajuda a construir decisões mais claras e participativas.
            </p>
            {/* Linha curta com sinais de confiança da plataforma. */}
            <p className="text-xs font-medium text-slate-500/80">
              Votações anónimas • Resultados transparentes • Dados agregados
            </p>
            {/* Área de ações e cartões auxiliares. */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                href="/about"
              >
                Quero participar
              </Link>
              <Link
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300"
                href="/votacoes"
              >
                Explorar votações
              </Link>
            </div>
          </div>
        </article>

        {/* Secção com resumo das últimas votações e gráficos de exemplo. */}
        <section className="mt-10 space-y-6">
          {/* Cabeçalho da secção com título e breve descrição. */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Últimas Votações
            </h2>
            <p className="mt-2 text-sm text-justify text-slate-500">
              Uma visão rápida das votações mais recentes — e de como a opinião
              coletiva evolui ao longo do tempo.
            </p>
          </div>

          {/* Grelha com três gráficos alinhados horizontalmente. */}
          <div className="grid gap-6 md:grid-cols-3">
            {chartCards.map((card) => (
              <article
                className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                key={card.title}
              >
                {/* Título do tema da votação. */}
                <h3 className="text-base font-semibold text-slate-900">
                  {card.title}
                </h3>

                {card.type === "stacked" ? (
                  <div className="mt-4 space-y-3">
                    {/* Linha com valores da opção principal. */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>{card.primaryLabel}</span>
                      <span>{card.primaryValue}%</span>
                    </div>
                    {/* Barra horizontal com percentagens empilhadas. */}
                    <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-[#fea076]"
                        style={{ width: `${card.primaryValue}%` }}
                      />
                      <div
                        className="h-full bg-[#b67ee8]"
                        style={{ width: `${card.secondaryValue}%` }}
                      />
                    </div>
                    {/* Linha com valores da opção secundária. */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>{card.secondaryLabel}</span>
                      <span>{card.secondaryValue}%</span>
                    </div>
                  </div>
                ) : null}

                {card.type === "bar" ? (
                  <div className="mt-4 space-y-3">
                    {/* Gráfico de barras verticais com três opções. */}
                    <div className="flex items-end gap-3">
                      {card.bars.map((bar) => (
                        <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                          <div className="relative h-28 w-full overflow-hidden rounded-lg bg-slate-100">
                            <div
                              className={`absolute bottom-0 left-0 w-full rounded-lg ${bar.color}`}
                              style={{ height: `${bar.value}%` }}
                            />
                          </div>
                          <span className="text-[0.65rem] font-medium text-slate-600">
                            {bar.label} {bar.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {card.type === "pie" ? (
                  <div className="mt-4 flex items-center gap-4">
                    {/* Gráfico circular com conic-gradient para as percentagens. */}
                    <div
                      className="h-24 w-24 rounded-full"
                      style={{
                        background: `conic-gradient(${card.segments
                          .map((segment, index) => {
                            const offset = card.segments
                              .slice(0, index)
                              .reduce((total, value) => total + value.value, 0);
                            return `${segment.color} ${offset}% ${offset + segment.value}%`;
                          })
                          .join(", ")})`,
                      }}
                    />
                    {/* Lista com a legenda do gráfico circular. */}
                    <ul className="space-y-2 text-xs font-medium text-slate-600">
                      {card.segments.map((segment) => (
                        <li key={segment.label} className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span>
                            {segment.label} {segment.value}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* Bloco discreto com ligação para a área Enterprise. */}
        <div className="mt-10 flex justify-center">
          <Link
            className="text-xs font-medium text-slate-500 transition hover:text-[color:var(--primary)]"
            href="/enterprise"
          >
            Para marcas e organizações → Enterprise
          </Link>
        </div>
      </div>
    </section>
  );
}
