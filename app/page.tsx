import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      {/* Grelha principal para alinhar o conteúdo à esquerda e a ilustração à direita. */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
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

        {/* Bloco visual com ilustração inspirada em dados e insights. */}
        <figure className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[color:var(--primary-soft)] via-white to-[color:var(--primary-soft)] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          {/* Halo de fundo para adicionar profundidade. */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color:var(--primary)]/10 blur-3xl" />
          {/* Cartão secundário para simular um dashboard. */}
          <div className="relative flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            {/* Título do painel visual. */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Insights
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  Tendências em tempo real
                </p>
              </div>
              <span className="rounded-full bg-[color:var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                +18%
              </span>
            </div>
            {/* Gráfico estilizado em SVG para representar dados. */}
            <svg
              aria-hidden="true"
              className="h-40 w-full"
              viewBox="0 0 320 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M10 120 C 40 90, 70 100, 100 80 C 130 60, 160 60, 190 45 C 220 30, 250 40, 310 20"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M10 120 C 40 90, 70 100, 100 80 C 130 60, 160 60, 190 45 C 220 30, 250 40, 310 20 L 310 160 L 10 160 Z"
                fill="url(#areaGradient)"
              />
              <circle cx="100" cy="80" r="6" fill="#3B82F6" />
              <circle cx="190" cy="45" r="6" fill="#22D3EE" />
              <circle cx="310" cy="20" r="6" fill="#3B82F6" />
            </svg>
            {/* Lista de métricas rápidas abaixo do gráfico. */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Engajamento</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">72%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Respostas</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">1.284</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Impacto</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">8.4</p>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
