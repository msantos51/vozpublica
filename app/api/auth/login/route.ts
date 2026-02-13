import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

type LoginPayload = {
  email: string;
  password: string;
};

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  birth_date: string | null;
  city: string | null;
  gender: string | null;
  education_level: string | null;
  profile_completed: boolean;
  is_admin: boolean;
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
    `select id, first_name, last_name, full_name, email, birth_date, city, gender, education_level, profile_completed, is_admin, password_hash
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

  try {
    // Cria a sessão autenticada e evita quebra total caso haja erro de configuração.
    await createSession({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível iniciar a sessão no servidor. Contacte o suporte." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Login efetuado com sucesso.",
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: user.full_name,
      email: user.email,
      birthDate: user.birth_date,
      city: user.city,
      gender: user.gender,
      educationLevel: user.education_level,
      profileCompleted: user.profile_completed,
      isAdmin: user.is_admin,
    },
  });
};
