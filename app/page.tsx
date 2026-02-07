import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-10">
      {/* Bloco de destaque com a proposta principal da plataforma. */}
      <div className="rounded-3xl bg-zinc-50 p-10 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Título principal da home page. */}
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Voz Pública: participação cidadã com informação clara.
          </h1>
          {/* Texto introdutório explicando o propósito do portal. */}
          <p className="max-w-2xl text-lg leading-7 text-zinc-600">
            Centralizamos notícias, projetos e consultas públicas para que cada
            cidadão acompanhe decisões locais e contribua com sugestões em tempo
            real.
          </p>
          {/* Ações principais para navegar ou começar a explorar. */}
          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              href="/about"
            >
              Conheça o projeto
            </Link>
            <button className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400">
              Explorar iniciativas
            </button>
          </div>
        </div>
      </div>

      {/* Secção com destaques rápidos do que o portal oferece. */}
      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Destaque do acompanhamento de projetos locais. */}
          <h2 className="text-lg font-semibold text-zinc-900">
            Projetos em andamento
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Acompanhe obras públicas, cronogramas e relatórios de impacto com
            total transparência.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Destaque das consultas públicas abertas. */}
          <h2 className="text-lg font-semibold text-zinc-900">
            Consultas abertas
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Participe de consultas e deixe contribuições que ajudam a melhorar
            serviços e políticas locais.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200 p-6">
          {/* Destaque para dados e indicadores públicos. */}
          <h2 className="text-lg font-semibold text-zinc-900">
            Indicadores públicos
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Veja métricas de mobilidade, saúde e educação reunidas em um painel
            simples de entender.
          </p>
        </article>
      </div>
    </section>
  );
}
