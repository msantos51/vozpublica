import { NextResponse } from "next/server";

import { query } from "@/lib/database";

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
};

type UpdatePayload = {
  currentEmail: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  gender: string;
  educationLevel: string;
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
    "select id, first_name, last_name, full_name, email, birth_date, city, gender, education_level, profile_completed from users where email = $1",
    [normalizedEmail]
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
    },
  });
};

export const PUT = async (request: Request) => {
  // Lê os dados do formulário para atualizar o perfil do utilizador.
  const payload = (await request.json()) as UpdatePayload;

  if (!payload.currentEmail || !payload.email || !payload.firstName || !payload.lastName) {
    return NextResponse.json(
      { message: "Primeiro nome, último nome e e-mail são obrigatórios." },
      { status: 400 }
    );
  }

  if (!payload.birthDate || !payload.city || !payload.gender || !payload.educationLevel) {
    return NextResponse.json(
      { message: "Data de nascimento, cidade, género e habilitações são obrigatórios." },
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

  const normalizedCurrentEmail = payload.currentEmail.trim().toLowerCase();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingUser = await query<UserRow>("select id from users where email = $1", [normalizedCurrentEmail]);

  if (!existingUser.rows[0]) {
    return NextResponse.json({ message: "Utilizador não encontrado." }, { status: 404 });
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
         profile_completed = true
     where email = $9`,
    [
      firstName,
      lastName,
      fullName,
      normalizedEmail,
      payload.birthDate,
      payload.city.trim(),
      payload.gender,
      payload.educationLevel,
      normalizedCurrentEmail,
    ]
  );

  return NextResponse.json({ message: "Perfil atualizado com sucesso." });
};
