type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

type ResendConfig = {
  apiKey: string;
  from: string;
  apiUrl: string;
  timeoutMs: number;
};

const defaultSender = "VozPublica <onboarding@resend.dev>";
const defaultApiUrl = "https://api.resend.com/emails";

const getResendConfig = (): ResendConfig => {
  // Lê configuração central do Resend para manter envio consistente entre registo e recuperação de conta.
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const from = process.env.RESEND_FROM?.trim() || defaultSender;
  const apiUrl = process.env.RESEND_API_URL?.trim() || defaultApiUrl;
  const timeoutMs = Number(process.env.RESEND_TIMEOUT_MS?.trim() || "10000");

  if (!apiKey) {
    throw new Error("RESEND_API_KEY não está definida para envio de e-mails transacionais.");
  }

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("RESEND_TIMEOUT_MS inválida.");
  }

  return {
    apiKey,
    from,
    apiUrl,
    timeoutMs,
  };
};

const getSafeErrorMessage = (error: unknown, fallbackMessage: string) => {
  // Normaliza erros para garantir mensagem útil nos logs e respostas do servidor.
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};

export const sendEmail = async (payload: MailPayload) => {
  // Envia e-mail transacional via API HTTP do Resend para evitar bloqueios de saída em portas SMTP.
  const config = getResendConfig();
  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), config.timeoutMs);

  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Resend API ${response.status}: ${responseText}`);
    }
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `Timeout ao enviar e-mail via Resend após ${config.timeoutMs}ms.`
        : getSafeErrorMessage(error, "Erro desconhecido durante o envio via Resend.");

    throw new Error(`${message} Verifique RESEND_API_KEY/RESEND_FROM e permissões do domínio configurado.`);
  } finally {
    clearTimeout(timeoutHandle);
  }
};
