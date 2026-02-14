import { NextResponse } from "next/server";

import { createEmailConfirmationTemplate } from "@/lib/authEmail";
import { query } from "@/lib/database";
import { sendEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { createToken, hashToken } from "@/lib/token";

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export const POST = async (request: Request) => {
  // Lê o corpo da requisição para criar o novo utilizador.
  const payload = (await request.json()) as RegisterPayload;

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.password || !payload.confirmPassword) {
    return NextResponse.json(
      { message: "Preencha primeiro nome, último nome, e-mail, senha e confirmação para continuar." },
      { status: 400 }
    );
  }

  if (payload.password !== payload.confirmPassword) {
    return NextResponse.json(
      { message: "A confirmação da senha deve ser igual à senha informada." },
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

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  const passwordHash = hashPassword(payload.password);
  const confirmationToken = createToken();
  const confirmationTokenHash = hashToken(confirmationToken);
  const firstAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const shouldBeAdmin = Boolean(firstAdminEmail) && normalizedEmail === firstAdminEmail;

  const result = await query<UserRow>(
    `insert into users (
      first_name,
      last_name,
      full_name,
      email,
      password_hash,
      profile_completed,
      email_confirmed,
      email_confirmation_token_hash,
      email_confirmation_sent_at,
      is_admin
    )
     values ($1, $2, $3, $4, $5, false, false, $6, now(), $7)
     returning id, first_name, last_name, full_name, email, is_admin, created_at`,
    [firstName, lastName, fullName, normalizedEmail, passwordHash, confirmationTokenHash, shouldBeAdmin]
  );

  try {
    // Envia e-mail de confirmação para bloquear login até validação da conta.
    const template = createEmailConfirmationTemplate(confirmationToken);
    await sendEmail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
    });
  } catch {
    return NextResponse.json(
      { message: "Conta criada, mas não foi possível enviar o e-mail de confirmação." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Conta criada com sucesso. Confirme o e-mail para ativar o acesso.",
    user: {
      id: result.rows[0]?.id,
      firstName: result.rows[0]?.first_name,
      lastName: result.rows[0]?.last_name,
      fullName: result.rows[0]?.full_name,
      email: result.rows[0]?.email,
      isAdmin: result.rows[0]?.is_admin ?? false,
    },
  });
};
