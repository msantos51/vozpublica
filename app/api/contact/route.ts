import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const contactRecipient = "vozpublica.contacto@gmail.com";

const sanitizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");


const normalizeContactMessage = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();

const isResendSandboxError = (errorMessage: string) =>
  errorMessage.toLowerCase().includes("you can only send testing emails");


export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "Corpo do pedido inválido." },
      { status: 400 },
    );
  }

  const name = sanitizeText(payload.name || "");
  const email = sanitizeText(payload.email || "").toLowerCase();
  const subject = sanitizeText(payload.subject || "");

  const message = normalizeContactMessage(payload.message || "");


  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { message: "Preencha nome, e-mail, assunto e mensagem para continuar." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  try {
    await sendEmail({
      to: contactRecipient,
      subject: `[Contacto] ${subject}`,

      replyTo: email,
      text: `Novo contacto recebido\n\nNome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,

      html: `
        <h2>Novo contacto recebido</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    return NextResponse.json({ message: "Mensagem enviada com sucesso." });
  } catch (error) {
    const safeMessage =
      error instanceof Error && error.message.trim()
        ? error.message
        : "Não foi possível enviar a mensagem no momento.";

    if (isResendSandboxError(safeMessage)) {
      return NextResponse.json(
        {
          message:
            "O envio está temporariamente indisponível por configuração do provedor de e-mail (modo de testes). A equipa já foi notificada para concluir a ativação do domínio.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "Não foi possível enviar a mensagem agora. Tente novamente em alguns minutos." },
      { status: 500 },
    );

  }
}
