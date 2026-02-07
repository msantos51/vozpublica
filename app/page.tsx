import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      {/* Grelha principal para alinhar o conteúdo à esquerda e a ilustração à direita. */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
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

        {/* Bloco visual inspirado em ilustração 3D abstrata de dados. */}
        <figure className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-white via-[color:var(--primary-soft)] to-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          {/* Luzes suaves para dar atmosfera e profundidade. */}
          <div className="absolute -top-16 right-4 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />

          {/* Base translúcida que sustenta o cenário. */}
          <div className="relative rounded-[32px] bg-white/70 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur">
            {/* Placa vertical com gráfico de barras e linha. */}
            <div className="relative mx-auto flex h-52 w-full max-w-sm items-end justify-center rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
              {/* Linha do gráfico para conectar os valores. */}
              <svg
                aria-hidden="true"
                className="absolute left-6 top-6 h-20 w-[calc(100%-3rem)]"
                viewBox="0 0 240 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 60 L60 44 L110 48 L160 28 L210 16"
                  stroke="url(#trendLine)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="44" r="4" fill="#93C5FD" />
                <circle cx="160" cy="28" r="4" fill="#67E8F9" />
              </svg>

              {/* Barras em estilo vidro para reforçar a sensação 3D. */}
              <div className="flex w-full items-end justify-between gap-3">
                <span className="h-20 w-6 rounded-2xl bg-gradient-to-b from-sky-200/70 to-sky-100/30 shadow-[0_10px_25px_rgba(125,211,252,0.35)]" />
                <span className="h-28 w-6 rounded-2xl bg-gradient-to-b from-sky-200/70 to-sky-100/30 shadow-[0_10px_25px_rgba(125,211,252,0.35)]" />
                <span className="h-24 w-6 rounded-2xl bg-gradient-to-b from-sky-300/70 to-sky-100/30 shadow-[0_10px_25px_rgba(125,211,252,0.35)]" />
                <span className="h-36 w-6 rounded-2xl bg-gradient-to-b from-sky-300/70 to-sky-100/30 shadow-[0_10px_25px_rgba(125,211,252,0.35)]" />
                <span className="h-32 w-6 rounded-2xl bg-gradient-to-b from-sky-200/70 to-sky-100/30 shadow-[0_10px_25px_rgba(125,211,252,0.35)]" />
              </div>
            </div>

            {/* Discos circulares em estilo glassmorphism. */}
            <div className="mt-6 flex items-center justify-between gap-6">
              <div className="h-16 w-16 rounded-full border border-white/70 bg-gradient-to-br from-white/70 to-sky-100/60 shadow-[0_12px_30px_rgba(15,23,42,0.1)]" />
              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="h-10 w-10 rounded-full border border-white/70 bg-gradient-to-br from-white/80 to-indigo-100/60 shadow-[0_10px_25px_rgba(15,23,42,0.08)]" />
                <div className="h-12 w-12 rounded-full border border-white/70 bg-gradient-to-br from-white/80 to-sky-100/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)]" />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
