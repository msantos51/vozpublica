import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashToken } from "@/lib/token";

type ConfirmRow = {
  id: string;
};

export const GET = async (request: Request) => {
  // Valida token recebido por query string para confirmar a conta.
  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(new URL("/login?confirmed=0", request.url));
  }

  const tokenHash = hashToken(token);

  const updateResult = await query<ConfirmRow>(
    `update users
     set
       email_confirmed = true,
       email_confirmation_token_hash = null
     where email_confirmation_token_hash = $1
     returning id`,
    [tokenHash]
  );

  if (!updateResult.rowCount) {
    return NextResponse.redirect(new URL("/login?confirmed=0", request.url));
  }

  return NextResponse.redirect(new URL("/login?confirmed=1", request.url));
};
