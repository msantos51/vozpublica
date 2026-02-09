import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashPassword } from "@/lib/password";

type RegisterPayload = {
  fullName: string;
  email: string;
  city: string;
  interest: string;
  password: string;
};

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  interest: string | null;
  created_at: string;
};

export const POST = async (request: Request) => {
  // Lê o corpo da requisição para criar o novo utilizador.
  const payload = (await request.json()) as RegisterPayload;

  if (!payload.fullName || !payload.email || !payload.password) {
    return NextResponse.json(
      { message: "Preencha o nome, e-mail e senha para continuar." },
      { status: 400 }
    );
  }

  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingUser = await query<UserRow>(
    "select id from users where email = $1",
    [normalizedEmail]
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    return NextResponse.json(
      { message: "Já existe uma conta registada com este e-mail." },
      { status: 409 }
    );
  }

  const passwordHash = hashPassword(payload.password);

  const result = await query<UserRow>(
    `insert into users (full_name, email, city, interest, password_hash)
     values ($1, $2, $3, $4, $5)
     returning id, full_name, email, city, interest, created_at`,
    [
      payload.fullName.trim(),
      normalizedEmail,
      payload.city?.trim() || null,
      payload.interest?.trim() || null,
      passwordHash,
    ]
  );

  return NextResponse.json({
    message: "Conta criada com sucesso.",
    user: {
      id: result.rows[0]?.id,
      fullName: result.rows[0]?.full_name,
      email: result.rows[0]?.email,
      city: result.rows[0]?.city,
      interest: result.rows[0]?.interest,
    },
  });
};
