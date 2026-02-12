import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { closeExpiredOpenPolls } from "@/lib/pollStatus";
import { getSession } from "@/lib/session";

type VotePayload = {
  option: string;
};

type PollRow = {
  id: string;
  options: string[];
  status: "draft" | "open" | "closed";
};

type VoteCountRow = {
  option_text: string;
  total_votes: string;
};

type ExistingVoteRow = {
  option_text: string;
};

const buildCounts = (options: string[], rows: VoteCountRow[]): Record<string, number> => {
  // Gera o mapa de totais garantindo que todas as opções aparecem no resultado.
  const baseCounts = options.reduce<Record<string, number>>((accumulator, option) => {
    accumulator[option] = 0;
    return accumulator;
  }, {});

  rows.forEach((row) => {
    if (baseCounts[row.option_text] === undefined) {
      return;
    }

    baseCounts[row.option_text] = Number(row.total_votes);
  });

  return baseCounts;
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ pollId: string }> }
) => {
  // Devolve os totais da votação e, se autenticado, o estado do voto do utilizador.
  const { pollId } = await params;

  await closeExpiredOpenPolls();
  const session = await getSession();

  const pollResult = await query<PollRow>(
    "select id, options, status from polls where id = $1",
    [pollId]
  );

  const poll = pollResult.rows[0];

  if (!poll) {
    return NextResponse.json({ message: "Votação não encontrada." }, { status: 404 });
  }

  const countResult = await query<VoteCountRow>(
    `select option_text, count(*)::text as total_votes
     from poll_votes
     where poll_id = $1
     group by option_text`,
    [pollId]
  );

  let selectedOption: string | null = null;

  if (session?.userId) {
    const existingVoteResult = await query<ExistingVoteRow>(
      `select option_text
       from poll_votes
       where poll_id = $1 and user_id = $2
       limit 1`,
      [pollId, session.userId]
    );

    selectedOption = existingVoteResult.rows[0]?.option_text ?? null;
  }

  return NextResponse.json({
    counts: buildCounts(poll.options, countResult.rows),
    selectedOption,
    hasSubmitted: Boolean(selectedOption),
    status: poll.status,
  });
};

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ pollId: string }> }
) => {
  // Regista o voto para a sessão autenticada e impede votos duplicados por utilizador.
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ message: "Faça login para participar." }, { status: 401 });
  }

  const payload = (await request.json()) as VotePayload;
  const { pollId } = await params;

  await closeExpiredOpenPolls();

  if (!payload.option) {
    return NextResponse.json({ message: "Selecione uma opção válida." }, { status: 400 });
  }

  const pollResult = await query<PollRow>(
    "select id, options, status from polls where id = $1",
    [pollId]
  );

  const poll = pollResult.rows[0];

  if (!poll) {
    return NextResponse.json({ message: "Votação não encontrada." }, { status: 404 });
  }

  if (poll.status !== "open") {
    return NextResponse.json(
      { message: "Esta votação está encerrada e não aceita novas respostas." },
      { status: 400 }
    );
  }

  if (!poll.options.includes(payload.option)) {
    return NextResponse.json({ message: "Opção inválida para esta votação." }, { status: 400 });
  }

  const insertResult = await query(
    `insert into poll_votes (poll_id, user_id, option_text)
     values ($1, $2, $3)
     on conflict (poll_id, user_id) do nothing`,
    [pollId, session.userId, payload.option]
  );

  if (!insertResult.rowCount) {
    return NextResponse.json(
      { message: "A sua resposta já foi submetida e não pode ser alterada." },
      { status: 409 }
    );
  }

  const countResult = await query<VoteCountRow>(
    `select option_text, count(*)::text as total_votes
     from poll_votes
     where poll_id = $1
     group by option_text`,
    [pollId]
  );

  return NextResponse.json({
    message: "Resposta registada com sucesso.",
    counts: buildCounts(poll.options, countResult.rows),
    selectedOption: payload.option,
    hasSubmitted: true,
  });
};
