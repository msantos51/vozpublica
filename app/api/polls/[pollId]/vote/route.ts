import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { closeExpiredOpenPolls } from "@/lib/pollStatus";

type VotePayload = {
  email: string;
  option: string;
};

type PollRow = {
  id: string;
  options: string[];
  status: "draft" | "open" | "closed";
};

type UserRow = {
  id: string;
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
  // Devolve os totais reais da votação e indica se o utilizador já respondeu.
  const { pollId } = await params;

  await closeExpiredOpenPolls();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

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

  if (email) {
    const existingVoteResult = await query<ExistingVoteRow>(
      `select pv.option_text
       from poll_votes pv
       inner join users u on u.id = pv.user_id
       where pv.poll_id = $1 and lower(u.email) = $2
       limit 1`,
      [pollId, email]
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
  // Regista o voto do utilizador autenticado e impede votos duplicados por votação.
  const payload = (await request.json()) as VotePayload;
  const { pollId } = await params;

  await closeExpiredOpenPolls();

  if (!payload.email || !payload.option) {
    return NextResponse.json({ message: "E-mail e opção são obrigatórios." }, { status: 400 });
  }

  const normalizedEmail = payload.email.trim().toLowerCase();

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

  const userResult = await query<UserRow>(
    "select id from users where lower(email) = $1",
    [normalizedEmail]
  );

  const user = userResult.rows[0];

  if (!user) {
    return NextResponse.json({ message: "Utilizador não encontrado." }, { status: 404 });
  }

  const insertResult = await query(
    `insert into poll_votes (poll_id, user_id, option_text)
     values ($1, $2, $3)
     on conflict (poll_id, user_id) do nothing`,
    [pollId, user.id, payload.option]
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
