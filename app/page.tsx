import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Coluna principal com cartões em estilo dashboard. */}
      <div className="space-y-6">
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

        {/* Linha com cartões de destaque e métricas. */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[28px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
            {/* Cartão de projetos em andamento. */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Projetos em andamento
              </h2>
              <span className="rounded-full bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                12 ativos
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Cronogramas, impacto e orçamento unificados em um único painel.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[color:var(--primary-soft)]" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Obra Central
                </p>
                <p className="text-xs text-slate-500">Entrega prevista: 18 dias</p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
            {/* Cartão com consultas públicas. */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Consultas abertas
              </h2>
              <span className="rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-xs font-semibold text-slate-500">
                5 novas
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Participe das consultas que definem prioridades para a cidade.
            </p>
            <div className="mt-6 rounded-2xl bg-[color:var(--surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Destaque
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Mobilidade urbana e ciclovias
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Encerra em 3 dias
              </p>
            </div>
          </article>
        </div>

        {/* Linha com gráficos simulados. */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[28px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
            {/* Gráfico de atividade semanal. */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Atividade</h2>
              <span className="rounded-full bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                +18%
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-2 rounded-full bg-[color:var(--surface-muted)]">
                <div className="h-2 w-3/4 rounded-full bg-[color:var(--accent)]" />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Seg</span>
                <span>Qua</span>
                <span>Sex</span>
                <span>Dom</span>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
            {/* Gráfico de pagamentos simulados. */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Financiamento</h2>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                65%
              </span>
            </div>
            <div className="mt-6 grid grid-cols-6 items-end gap-2">
              <div className="h-16 rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-24 rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-12 rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-32 rounded-full bg-[color:var(--primary)]" />
              <div className="h-20 rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-14 rounded-full bg-[color:var(--surface-muted)]" />
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>
          </article>
        </div>
      </div>

      {/* Coluna lateral com indicadores e saldo. */}
      <aside className="space-y-6">
        {/* Cartão de progresso com indicador circular. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-6 text-center shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-[color:var(--accent)] text-2xl font-semibold text-slate-900">
            68%
          </div>
          <p className="mt-4 text-sm text-slate-400">Meta de participação</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">1248,40</p>
          <p className="text-xs text-slate-400">Contribuições disponíveis</p>
        </article>

        {/* Lista com categorias de orçamento. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <h2 className="text-lg font-semibold text-slate-900">Distribuição</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[color:var(--primary)]" />
                Educação
              </span>
              <span className="text-slate-500">-324,30</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[color:var(--accent)]" />
                Saúde
              </span>
              <span className="text-slate-500">-218,60</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                Mobilidade
              </span>
              <span className="text-slate-500">-118,00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                Cultura
              </span>
              <span className="text-slate-500">-98,00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-300" />
                Esporte
              </span>
              <span className="text-slate-500">-85,60</span>
            </div>
          </div>
        </article>
      </aside>
    </section>
  );
}
