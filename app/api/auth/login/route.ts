import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { verifyPassword } from "@/lib/password";

type LoginPayload = {
  email: string;
  password: string;
};

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  interest: string | null;
  password_hash: string;
};

export const POST = async (request: Request) => {
  // Lê o corpo da requisição para validar as credenciais.
  const payload = (await request.json()) as LoginPayload;

  if (!payload.email || !payload.password) {
    return NextResponse.json(
      { message: "Informe o e-mail e a senha para continuar." },
      { status: 400 }
    );
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const result = await query<UserRow>(
    `select id, full_name, email, city, interest, password_hash
     from users
     where email = $1`,
    [normalizedEmail]
  );

  const user = result.rows[0];

  if (!user || !verifyPassword(payload.password, user.password_hash)) {
    return NextResponse.json(
      { message: "E-mail ou senha inválidos. Verifique os dados e tente novamente." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login efetuado com sucesso.",
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      city: user.city,
      interest: user.interest,
    },
  });
};
