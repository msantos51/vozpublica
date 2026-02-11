import { NextResponse } from "next/server";

import { ensureAdminAccess } from "@/lib/admin";
import { query } from "@/lib/database";

type UpdatePollPayload = {
  requesterEmail: string;
  title: string;
  description: string;
  prompt: string;
  options: string[];
  startsAt: string | null;
  endsAt: string | null;
  status: "draft" | "open" | "closed";
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ pollId: string }> }
) => {
  // Atualiza conteúdo e estado da poll para abrir, fechar ou manter em rascunho.
  const payload = (await request.json()) as UpdatePollPayload;
  const { pollId } = await params;

  if (!payload.requesterEmail || !payload.title || !payload.description || !payload.prompt) {
    return NextResponse.json({ message: "Preencha título, descrição, pergunta e admin." }, { status: 400 });
  }

  const normalizedOptions = payload.options
    ?.map((option) => option.trim())
    .filter(Boolean) ?? [];

  if (normalizedOptions.length < 2) {
    return NextResponse.json({ message: "Inclua pelo menos duas opções." }, { status: 400 });
  }

  if (!["draft", "open", "closed"].includes(payload.status)) {
    return NextResponse.json({ message: "Estado da poll inválido." }, { status: 400 });
  }

  try {
    await ensureAdminAccess(payload.requesterEmail);
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

  const updateResult = await query(
    `update polls
     set title = $1,
         description = $2,
         prompt = $3,
         options = $4::jsonb,
         status = $5,
         starts_at = $6,
         ends_at = $7,
         updated_at = now()
     where id = $8`,
    [
      payload.title.trim(),
      payload.description.trim(),
      payload.prompt.trim(),
      JSON.stringify(normalizedOptions),
      payload.status,
      startsAt ? startsAt.toISOString() : null,
      endsAt ? endsAt.toISOString() : null,
      pollId,
    ]
  );

  if (!updateResult.rowCount) {
    return NextResponse.json({ message: "Poll não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ message: "Poll atualizada com sucesso." });
};
