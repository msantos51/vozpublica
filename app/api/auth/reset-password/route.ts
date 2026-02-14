import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashPassword } from "@/lib/password";
import { hashToken } from "@/lib/token";

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

type UserRow = {
  id: string;
};

export const POST = async (request: Request) => {
  // Atualiza password usando token válido recebido por e-mail de recuperação.
  const payload = (await request.json()) as ResetPasswordPayload;

  if (!payload.token || !payload.newPassword || !payload.confirmPassword) {
    return NextResponse.json(
      { message: "Token, nova password e confirmação são obrigatórios." },
      { status: 400 }
    );
  }

  if (payload.newPassword !== payload.confirmPassword) {
    return NextResponse.json(
      { message: "A confirmação da nova password deve ser igual." },
      { status: 400 }
    );
  }

  const tokenHash = hashToken(payload.token.trim());
  const passwordHash = hashPassword(payload.newPassword);

  const updateResult = await query<UserRow>(
    `update users
     set
       password_hash = $1,
       password_reset_token_hash = null,
       password_reset_expires_at = null
     where password_reset_token_hash = $2
       and password_reset_expires_at is not null
       and password_reset_expires_at > now()
     returning id`,
    [passwordHash, tokenHash]
  );

  if (!updateResult.rowCount) {
    return NextResponse.json(
      { message: "O link de recuperação é inválido ou expirou." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Password atualizada com sucesso." });
};
