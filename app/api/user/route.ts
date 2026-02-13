import { NextResponse } from "next/server";

import { query } from "@/lib/database";
import { hashNationalId, isValidNationalIdFormat, normalizeNationalId } from "@/lib/identity";
import { getSession } from "@/lib/session";

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
  national_id_hash: string | null;
};

type UpdatePayload = {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  gender: string;
  educationLevel: string;
  nationalId: string;
};

const allowedGender = ["male", "female"];
const allowedEducationLevels = [
  "6th_grade",
  "9th_grade",
  "12th_grade",
  "bachelor",
  "master",
  "doctorate",
];

export const GET = async () => {
  // Devolve o perfil do utilizador autenticado com base na sessão server-side.
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      { message: "É necessário iniciar sessão para carregar o perfil." },
      { status: 401 }
    );
  }

  const result = await query<UserRow>(
    "select id, first_name, last_name, full_name, email, birth_date, city, gender, education_level, profile_completed, is_admin, national_id_hash from users where id = $1",
    [session.userId]
  );

  if (!result.rows[0]) {
    return NextResponse.json({ message: "Utilizador não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      fullName: result.rows[0].full_name,
      email: result.rows[0].email,
      birthDate: result.rows[0].birth_date,
      city: result.rows[0].city,
      gender: result.rows[0].gender,
      educationLevel: result.rows[0].education_level,
      profileCompleted: result.rows[0].profile_completed,
      isAdmin: result.rows[0].is_admin,
      hasNationalId: Boolean(result.rows[0].national_id_hash),
    },
  });
};

export const PUT = async (request: Request) => {
  // Atualiza o perfil do utilizador autenticado sem confiar em e-mail enviado pelo cliente.
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json(
      { message: "É necessário iniciar sessão para atualizar o perfil." },
      { status: 401 }
    );
  }

  const payload = (await request.json()) as UpdatePayload;

  if (!payload.email || !payload.firstName || !payload.lastName) {
    return NextResponse.json(
      { message: "Primeiro nome, último nome e e-mail são obrigatórios." },
      { status: 400 }
    );
  }

  if (!payload.nationalId || !payload.birthDate || !payload.city || !payload.gender || !payload.educationLevel) {
    return NextResponse.json(
      { message: "NIF, data de nascimento, cidade, género e habilitações são obrigatórios." },
      { status: 400 }
    );
  }

  if (!allowedGender.includes(payload.gender)) {
    return NextResponse.json({ message: "Género inválido." }, { status: 400 });
  }

  if (!allowedEducationLevels.includes(payload.educationLevel)) {
    return NextResponse.json(
      { message: "Habilitação literária inválida." },
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

  const nationalIdHash = hashNationalId(normalizedNationalId);

  const conflictingNationalId = await query<UserRow>(
    "select id from users where national_id_hash = $1 and id <> $2",
    [nationalIdHash, session.userId]
  );

  if (conflictingNationalId.rowCount) {
    return NextResponse.json(
      { message: "Já existe uma conta associada a este NIF." },
      { status: 409 }
    );
  }
  const normalizedEmail = payload.email.trim().toLowerCase();

  const conflictingUser = await query<UserRow>(
    "select id from users where email = $1 and id <> $2",
    [normalizedEmail, session.userId]
  );

  if (conflictingUser.rowCount) {
    return NextResponse.json(
      { message: "Já existe uma conta registada com este e-mail." },
      { status: 409 }
    );
  }

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const fullName = `${firstName} ${lastName}`.trim();

  await query(
    `update users
     set first_name = $1,
         last_name = $2,
         full_name = $3,
         email = $4,
         birth_date = $5,
         city = $6,
         gender = $7,
         education_level = $8,
         national_id_hash = $9,
         profile_completed = true
     where id = $10`,
    [
      firstName,
      lastName,
      fullName,
      normalizedEmail,
      payload.birthDate,
      payload.city.trim(),
      payload.gender,
      payload.educationLevel,
      nationalIdHash,
      session.userId,
    ]
  );

  return NextResponse.json({ message: "Perfil atualizado com sucesso." });
};
