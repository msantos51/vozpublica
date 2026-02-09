import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashPassword } from "@/lib/password";

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  interest: string | null;
};

type UpdatePayload = {
  currentEmail: string;
  email: string;
  fullName: string;
  city: string;
  interest: string;
  password?: string;
};

export const GET = async (request: Request) => {
  // Obtém o e-mail a partir da query string para devolver o perfil.
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "O e-mail é obrigatório para carregar o perfil." },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const result = await query<UserRow>(
    "select id, full_name, email, city, interest from users where email = $1",
    [normalizedEmail]
  );

  if (!result.rows[0]) {
    return NextResponse.json(
      { message: "Utilizador não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user: {
      id: result.rows[0].id,
      fullName: result.rows[0].full_name,
      email: result.rows[0].email,
      city: result.rows[0].city,
      interest: result.rows[0].interest,
    },
  });
};

export const PUT = async (request: Request) => {
  // Lê os dados do formulário para atualizar o perfil do utilizador.
  const payload = (await request.json()) as UpdatePayload;

  if (!payload.email || !payload.fullName || !payload.currentEmail) {
    return NextResponse.json(
      { message: "Nome e e-mail são obrigatórios para atualizar o perfil." },
      { status: 400 }
    );
  }

  const normalizedCurrentEmail = payload.currentEmail.trim().toLowerCase();
  const normalizedEmail = payload.email.trim().toLowerCase();
  const updateValues = [
    payload.fullName.trim(),
    normalizedEmail,
    payload.city?.trim() || null,
    payload.interest?.trim() || null,
    normalizedCurrentEmail,
  ];

  if (payload.password) {
    const passwordHash = hashPassword(payload.password);
    await query(
      `update users
       set full_name = $1,
           email = $2,
           city = $3,
           interest = $4,
           password_hash = $5
       where email = $6`,
      [...updateValues.slice(0, 4), passwordHash, updateValues[4]]
    );
  } else {
    await query(
      `update users
       set full_name = $1,
           email = $2,
           city = $3,
           interest = $4
       where email = $5`,
      updateValues
    );
  }

  return NextResponse.json({ message: "Perfil atualizado com sucesso." });
};
