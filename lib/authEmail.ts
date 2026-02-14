const normalizeBaseUrl = (rawUrl: string) => {
  // Remove espaços e barra final para evitar URLs duplicadas com "//" ao concatenar paths.
  const sanitizedUrl = rawUrl.trim().replace(/\/+$/, "");

  // Prefixa protocolo HTTPS quando a variável vier só com host (ex.: domínio sem esquema).
  if (!/^https?:\/\//i.test(sanitizedUrl)) {
    return `https://${sanitizedUrl}`;
  }

  return sanitizedUrl;
};

const resolveAppBaseUrl = () => {
  // Resolve a URL pública da aplicação com fallback entre variáveis comuns de deploy.
  const rawBaseUrl =
    process.env.APP_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    process.env.RENDER_EXTERNAL_URL?.trim() ||
    "http://localhost:3000";

  return normalizeBaseUrl(rawBaseUrl);
};

const createLayout = (title: string, description: string, buttonLabel: string, buttonUrl: string) => {
  // Gera HTML padronizado para e-mails de autenticação com CTA principal.
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
      <h1 style="font-size: 24px; margin-bottom: 12px;">${title}</h1>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">${description}</p>
      <a href="${buttonUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 700;">
        ${buttonLabel}
      </a>
      <p style="font-size: 13px; color: #475569; margin-top: 18px; line-height: 1.4;">
        Se o botão não funcionar, copie e cole este link no browser:<br />
        <a href="${buttonUrl}" style="color: #2563eb;">${buttonUrl}</a>
      </p>
    </div>
  `;
};

export const createEmailConfirmationTemplate = (token: string) => {
  // Monta o conteúdo do e-mail de confirmação de conta para ativar o primeiro acesso.
  const appBaseUrl = resolveAppBaseUrl();
  const confirmationUrl = `${appBaseUrl}/api/auth/confirm-email?token=${encodeURIComponent(token)}`;

  return {
    subject: "Confirmação de conta - VozPública",
    html: createLayout(
      "Confirme a sua conta",
      "Obrigado pelo registo. Para concluir a criação da conta e poder iniciar sessão, confirme o seu e-mail.",
      "Confirmar conta",
      confirmationUrl
    ),
  };
};

export const createPasswordResetTemplate = (token: string) => {
  // Monta o conteúdo do e-mail de reposição de palavra-passe com validade limitada.
  const appBaseUrl = resolveAppBaseUrl();
  const resetUrl = `${appBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;

  return {
    subject: "Reposição de password - VozPública",
    html: createLayout(
      "Reposição de password",
      "Recebemos um pedido para redefinir a sua password. Clique no botão abaixo para criar uma nova password.",
      "Redefinir password",
      resetUrl
    ),
  };
};
