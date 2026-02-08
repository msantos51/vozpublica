import Link from "next/link";

export default function HomePage() {
  const chartItems = [
    {
      title: "Habitação acessível",
      primaryLabel: "A favor",
      primaryValue: 62,
      secondaryLabel: "Contra",
      secondaryValue: 38,
    },
    {
      title: "Transporte público gratuito",
      primaryLabel: "Sim",
      primaryValue: 54,
      secondaryLabel: "Não",
      secondaryValue: 46,
    },
    {
      title: "Mais espaços verdes",
      primaryLabel: "Prioridade alta",
      primaryValue: 71,
      secondaryLabel: "Outros temas",
      secondaryValue: 29,
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
                Dá voz ao que pensas.
              </p>
              <h1 className="mt-2 text-[1.7rem] font-semibold text-justify text-slate-900">
                A <span className="text-[#b67ee8]">Voz Pública</span> é um espaço
                aberto onde qualquer pessoa pode participar, votar e acompanhar
                a opinião coletiva sobre os temas que realmente importam.
              </h1>
            </div>
            {/* Texto complementar sobre o painel. */}
            <p className="text-sm leading-6 text-justify text-slate-500">
              Escolhe os temas que queres acompanhar, partilha a tua opinião e
              ajuda a construir decisões mais claras e participativas.
            </p>
            {/* Área de ações e cartões auxiliares. */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                className="rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                href="/about"
              >
                Quero participar
              </Link>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300">
                Explorar votações
              </button>
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
              Uma visão rápida das votações mais recentes com resultados
              ilustrativos.
            </p>
          </div>

          {/* Grelha com três gráficos alinhados horizontalmente. */}
          <div className="grid gap-6 md:grid-cols-3">
            {chartItems.map((item) => (
              <article
                className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                key={item.title}
              >
                {/* Título do tema da votação. */}
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                {/* Área com legendas e barra horizontal com as duas cores. */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>{item.primaryLabel}</span>
                    <span>{item.primaryValue}%</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-[#fea076]"
                      style={{ width: `${item.primaryValue}%` }}
                    />
                    <div
                      className="h-full bg-[#b67ee8]"
                      style={{ width: `${item.secondaryValue}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>{item.secondaryLabel}</span>
                    <span>{item.secondaryValue}%</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
