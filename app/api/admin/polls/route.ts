import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { closeExpiredOpenPolls } from "@/lib/pollStatus";
import { getSession } from "@/lib/session";

type PollRow = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  options: string[];
  status: "draft" | "open" | "closed";
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

type CreatePollPayload = {
  title: string;
  description: string;
  prompt: string;
  options: string[];
  startsAt: string | null;
  endsAt: string | null;
};

const ensureAdminSession = async () => {
  // Valida se existe sessão autenticada com perfil admin para operações sensíveis.
  const session = await getSession();

  if (!session?.isAdmin) {
    return null;
  }

  return session;
};

export const GET = async () => {
  // Devolve todas as polls apenas para sessões administrativas autenticadas.
  const session = await ensureAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
  }

  await closeExpiredOpenPolls();

  const result = await query<PollRow>(
    `select id, title, description, prompt, options, status, starts_at, ends_at, created_at
     from polls
     order by created_at desc`
  );

  return NextResponse.json({ polls: result.rows });
};

export const POST = async (request: Request) => {
  // Cria uma nova poll em rascunho associada ao admin autenticado na sessão.
  const session = await ensureAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
  }

  const payload = (await request.json()) as CreatePollPayload;

  if (!payload.title || !payload.description || !payload.prompt) {
    return NextResponse.json({ message: "Preencha título, descrição e pergunta." }, { status: 400 });
  }

  const normalizedOptions = payload.options
    ?.map((option) => option.trim())
    .filter(Boolean) ?? [];

  if (normalizedOptions.length < 2) {
    return NextResponse.json(
      { message: "Inclua pelo menos duas opções para a poll." },
      { status: 400 }
    );
  }

  const startsAt = payload.startsAt ? new Date(payload.startsAt) : null;
  const endsAt = payload.endsAt ? new Date(payload.endsAt) : null;

  if (startsAt && endsAt && endsAt <= startsAt) {
    return NextResponse.json(
      { message: "O prazo final tem de ser posterior à data de abertura." },
      { status: 400 }
    );
  }

  const result = await query<PollRow>(
    `insert into polls (title, description, prompt, options, status, starts_at, ends_at, created_by, updated_at)
     values ($1, $2, $3, $4::jsonb, 'draft', $5, $6, $7, now())
     returning id, title, description, prompt, options, status, starts_at, ends_at, created_at`,
    [
      payload.title.trim(),
      payload.description.trim(),
      payload.prompt.trim(),
      JSON.stringify(normalizedOptions),
      startsAt ? startsAt.toISOString() : null,
      endsAt ? endsAt.toISOString() : null,
      session.userId,
    ]
  );

  return NextResponse.json({
    message: "Poll criada com sucesso em modo rascunho.",
    poll: result.rows[0],
  });
};
