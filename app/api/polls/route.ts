import { NextResponse } from "next/server";

import { query } from "@/lib/database";


export const dynamic = "force-dynamic";


type PollRow = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  options: string[];
  status: "draft" | "open" | "closed";
  starts_at: string | null;
  ends_at: string | null;
};

export const GET = async () => {

  // Desativa cache estática para devolver sempre o estado mais recente das polls.

  // Devolve apenas polls que podem ser exibidas ao público (abertas ou encerradas).
  const result = await query<PollRow>(
    `select id, title, description, prompt, options, status, starts_at, ends_at
     from polls
     where status in ('open', 'closed')
     order by coalesce(starts_at, created_at) desc`
  );

  return NextResponse.json({ polls: result.rows });
};
