import Link from "next/link";

export default function HomePage() {
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
                A Voz Pública é um espaço aberto onde qualquer pessoa pode
                participar, votar e acompanhar a opinião coletiva sobre os
                temas que realmente importam.
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
      </div>
    </section>
  );
}
