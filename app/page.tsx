import Link from "next/link";

import { query } from "@/lib/database";

type ClosedPollRow = {
  id: string;
  title: string;
  options: string[];
};

type VoteCountRow = {
  poll_id: string;
  option_text: string;
  total_votes: string;
};

type PollResult = {
  id: string;
  title: string;
  options: Array<{
    label: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
};

const buildPollResults = (
  polls: ClosedPollRow[],
  voteRows: VoteCountRow[]
): PollResult[] => {
  // Constrói os resultados finais por poll com percentagens para o bloco da home.
  return polls.map((poll) => {
    const pollVoteMap = poll.options.reduce<Record<string, number>>((accumulator, option) => {
      accumulator[option] = 0;
      return accumulator;
    }, {});

    voteRows
      .filter((voteRow) => voteRow.poll_id === poll.id)
      .forEach((voteRow) => {
        if (pollVoteMap[voteRow.option_text] === undefined) {
          return;
        }

        pollVoteMap[voteRow.option_text] = Number(voteRow.total_votes);
      });

    const totalVotes = Object.values(pollVoteMap).reduce((total, count) => total + count, 0);

    return {
      id: poll.id,
      title: poll.title,
      totalVotes,
      options: poll.options.map((option) => {
        const votes = pollVoteMap[option] ?? 0;
        const percentage = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

        return {
          label: option,
          votes,
          percentage,
        };
      }),
    };
  });
};

export default async function HomePage() {
  // Carrega as 3 votações mais recentes já encerradas para remover dados fictícios.
  const closedPollsResult = await query<ClosedPollRow>(
    `select id, title, options
     from polls
     where status = 'closed'
     order by coalesce(ends_at, updated_at, created_at) desc
     limit 3`
  );

  const closedPollIds = closedPollsResult.rows.map((poll) => poll.id);

  const voteCountsResult = closedPollIds.length
    ? await query<VoteCountRow>(
        `select poll_id, option_text, count(*)::text as total_votes
         from poll_votes
         where poll_id = any($1::uuid[])
         group by poll_id, option_text`,
        [closedPollIds]
      )
    : { rows: [] };

  const latestResults = buildPollResults(closedPollsResult.rows, voteCountsResult.rows);

  return (
    <section>
      {/* Contém a secção principal centrada com largura confortável para o texto. */}
      <div className="mx-auto w-full max-w-5xl">
        {/* Cartão com resumo geral e ação principal. */}
        <article className="rounded-[32px] bg-[color:var(--surface)] p-8 shadow-[0_20px_50px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-6">
            {/* Título principal da página com destaque de marca. */}
            <div>
              <h1 className="page-title text-justify">
                Dá voz ao que pensas. Vê o que os outros pensam.
              </h1>
            </div>
            {/* Área de ações e cartões auxiliares. */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                className="button-size-login bg-[color:var(--primary)] text-white shadow-sm transition hover:brightness-95"
                href="/about"
              >
                Quero participar
              </Link>
              <Link
                className="button-size-login border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
                href="/votacoes"
              >
                Explorar votações
              </Link>
            </div>
          </div>
        </article>

        {/* Secção com resumo das últimas votações encerradas com resultados reais. */}
        <section className="mt-10 space-y-6">
          {/* Cabeçalho da secção com título e breve descrição. */}
          <div>
            <h2 className="section-title">Últimas Votações</h2>
            <p className="mt-2 text-sm text-justify text-slate-500">
              Uma visão rápida das votações encerradas mais recentes e dos respetivos resultados.
            </p>
          </div>

          {!latestResults.length ? (
            <div className="rounded-[24px] border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              Ainda não existem votações encerradas com resultados para apresentar.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {latestResults.map((result) => (
                <article
                  className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  key={result.id}
                >
                  {/* Título do tema da votação. */}
                  <h3 className="subsection-title">{result.title}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Total de votos: {result.totalVotes}
                  </p>

                  <div className="mt-4 space-y-3">
                    {result.options.map((option) => (
                      <div key={option.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                          <span>{option.label}</span>
                          <span>
                            {option.percentage}% ({option.votes})
                          </span>
                        </div>
                        <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-[color:var(--primary)]"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
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
