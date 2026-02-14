import { NextResponse } from "next/server";

import { createPasswordResetTemplate } from "@/lib/authEmail";
import { query } from "@/lib/database";
import { sendEmail } from "@/lib/email";
import { createToken, hashToken } from "@/lib/token";

type ForgotPasswordPayload = {
  email: string;
};

type UserRow = {
  id: string;
  email: string;
};

const resetTokenDurationMs = 1000 * 60 * 30;

export const POST = async (request: Request) => {
  // Recebe o e-mail e envia instruções de recuperação sem expor existência da conta.
  const payload = (await request.json()) as ForgotPasswordPayload;

  if (!payload.email) {
    return NextResponse.json(
      { message: "Informe o e-mail para recuperação de password." },
      { status: 400 }
    );
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const userResult = await query<UserRow>("select id, email from users where email = $1", [normalizedEmail]);
  const user = userResult.rows[0];

  if (user) {
    const token = createToken();
    const tokenHash = hashToken(token);

    await query(
      `update users
       set
         password_reset_token_hash = $1,
         password_reset_expires_at = to_timestamp($2 / 1000.0)
       where id = $3`,
      [tokenHash, Date.now() + resetTokenDurationMs, user.id]
    );

    const template = createPasswordResetTemplate(token);
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });
  }

  return NextResponse.json({
    message: "Se o e-mail estiver registado, enviámos instruções para redefinir a password.",
  });
};
