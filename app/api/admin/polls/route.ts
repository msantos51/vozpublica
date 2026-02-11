import { NextResponse } from "next/server";

import { ensureAdminAccess } from "@/lib/admin";
import { query } from "@/lib/database";
import { closeExpiredOpenPolls } from "@/lib/pollStatus";

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
  requesterEmail: string;
  title: string;
  description: string;
  prompt: string;
  options: string[];
  startsAt: string | null;
  endsAt: string | null;
};

export const GET = async (request: Request) => {
  // Valida o acesso admin antes de devolver todas as polls para gestão.
  const { searchParams } = new URL(request.url);
  const requesterEmail = searchParams.get("requesterEmail");

  if (!requesterEmail) {
    return NextResponse.json({ message: "Conta admin não informada." }, { status: 400 });
  }

  try {
    await ensureAdminAccess(requesterEmail);
  } catch (error) {
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
  // Cria uma nova poll com estado inicial de rascunho para revisão do admin.
  const payload = (await request.json()) as CreatePollPayload;

  if (!payload.requesterEmail || !payload.title || !payload.description || !payload.prompt) {
    return NextResponse.json({ message: "Preencha título, descrição, pergunta e admin." }, { status: 400 });
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

  let adminId = "";

  try {
    const admin = await ensureAdminAccess(payload.requesterEmail);
    adminId = admin.id;
  } catch (error) {
    return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
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
      adminId,
    ]
  );

  return NextResponse.json({
    message: "Poll criada com sucesso em modo rascunho.",
    poll: result.rows[0],
  });
};
