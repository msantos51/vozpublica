import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashNationalId, isValidNationalIdFormat, normalizeNationalId } from "@/lib/identity";
import { hashPassword } from "@/lib/password";

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  password: string;
  confirmPassword: string;
};

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  created_at: string;
};

export const POST = async (request: Request) => {
  // Lê o corpo da requisição para criar o novo utilizador.
  const payload = (await request.json()) as RegisterPayload;

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.nationalId || !payload.password || !payload.confirmPassword) {
    return NextResponse.json(
      { message: "Preencha primeiro nome, último nome, e-mail, NIF, senha e confirmação para continuar." },
      { status: 400 }
    );
  }

  if (payload.password !== payload.confirmPassword) {
    return NextResponse.json(
      { message: "A confirmação da senha deve ser igual à senha informada." },
      { status: 400 }
    );
  }

  const normalizedNationalId = normalizeNationalId(payload.nationalId);

  if (!isValidNationalIdFormat(normalizedNationalId)) {
    return NextResponse.json(
      { message: "O NIF deve conter exatamente 9 dígitos." },
      { status: 400 }
    );
  }

  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingUserByEmail = await query<UserRow>("select id from users where email = $1", [normalizedEmail]);

  if (existingUserByEmail.rowCount && existingUserByEmail.rowCount > 0) {
    return NextResponse.json(
      { message: "Já existe uma conta registada com este e-mail." },
      { status: 409 }
    );
  }

  const nationalIdHash = hashNationalId(normalizedNationalId);
  const existingUserByNationalId = await query<UserRow>("select id from users where national_id_hash = $1", [nationalIdHash]);

  if (existingUserByNationalId.rowCount && existingUserByNationalId.rowCount > 0) {
    return NextResponse.json(
      { message: "Já existe uma conta associada a este NIF." },
      { status: 409 }
    );
  }

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  const passwordHash = hashPassword(payload.password);

  const result = await query<UserRow>(
    `insert into users (first_name, last_name, full_name, email, national_id_hash, password_hash, profile_completed)
     values ($1, $2, $3, $4, $5, $6, false)
     returning id, first_name, last_name, full_name, email, created_at`,
    [firstName, lastName, fullName, normalizedEmail, nationalIdHash, passwordHash]
  );

  return NextResponse.json({
    message: "Conta criada com sucesso.",
    user: {
      id: result.rows[0]?.id,
      firstName: result.rows[0]?.first_name,
      lastName: result.rows[0]?.last_name,
      fullName: result.rows[0]?.full_name,
      email: result.rows[0]?.email,
    },
  });
};
