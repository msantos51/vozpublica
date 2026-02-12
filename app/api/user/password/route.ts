import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";

type PasswordChangePayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type UserCredentialsRow = {
  id: string;
  password_hash: string;
};

export const PUT = async (request: Request) => {
  // Atualiza senha do utilizador autenticado validando credencial atual no servidor.
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      { message: "É necessário iniciar sessão para alterar a senha." },
      { status: 401 }
    );
  }

  const payload = (await request.json()) as PasswordChangePayload;

  if (!payload.currentPassword || !payload.newPassword || !payload.confirmNewPassword) {
    return NextResponse.json(
      { message: "Preencha a senha atual, nova senha e confirmação." },
      { status: 400 }
    );
  }

  if (payload.newPassword !== payload.confirmNewPassword) {
    return NextResponse.json(
      { message: "A confirmação da nova senha deve ser igual à nova senha." },
      { status: 400 }
    );
  }

  const userResult = await query<UserCredentialsRow>(
    "select id, password_hash from users where id = $1",
    [session.userId]
  );

  const user = userResult.rows[0];

  if (!user) {
    return NextResponse.json(
      { message: "Utilizador não encontrado." },
      { status: 404 }
    );
  }

  if (!verifyPassword(payload.currentPassword, user.password_hash)) {
    return NextResponse.json(
      { message: "A senha atual está incorreta." },
      { status: 401 }
    );
  }

  const newPasswordHash = hashPassword(payload.newPassword);

  await query("update users set password_hash = $1 where id = $2", [
    newPasswordHash,
    user.id,
  ]);

  return NextResponse.json({ message: "Senha atualizada com sucesso." });
};
