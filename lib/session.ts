import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const sessionCookieName = "vp_session_token";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  email: string;
  isAdmin: boolean;
  exp: number;
};

const getSessionSecret = () => {
  // Obtém a chave de assinatura da sessão e bloqueia execução sem configuração segura.
  const secret = process.env.SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error("SESSION_SECRET_NOT_CONFIGURED");
  }

  return secret;
};

const toBase64Url = (value: string) => {
  // Converte texto para base64url para permitir transporte seguro no cookie.
  return Buffer.from(value, "utf8").toString("base64url");
};

const fromBase64Url = (value: string) => {
  // Converte base64url para texto original antes da validação da assinatura.
  return Buffer.from(value, "base64url").toString("utf8");
};

const sign = (value: string, secret: string) => {
  // Gera assinatura HMAC SHA-256 para prevenir adulteração do token de sessão.
  return createHmac("sha256", secret).update(value).digest("base64url");
};

const safeCompare = (left: string, right: string) => {
  // Compara assinaturas em tempo constante para reduzir risco de timing attacks.
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const createSessionToken = (payload: Omit<SessionPayload, "exp">) => {
  // Cria token assinado contendo os dados mínimos necessários da sessão autenticada.
  const secret = getSessionSecret();
  const sessionPayload: SessionPayload = {
    ...payload,
    exp: Date.now() + sessionDurationMs,
  };
  const encodedPayload = toBase64Url(JSON.stringify(sessionPayload));
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
};

const parseSessionToken = (token: string): SessionPayload | null => {
  // Valida assinatura, integridade e expiração do token antes de aceitar a sessão.
  const secret = getSessionSecret();
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload, secret);

  if (!safeCompare(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (!payload.userId || !payload.email || typeof payload.isAdmin !== "boolean") {
      return null;
    }

    if (!payload.exp || payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const createSession = async (session: Omit<SessionPayload, "exp">) => {
  // Persiste cookie HTTP-only com sessão assinada para autenticação server-side.
  const cookieStore = await cookies();
  const token = createSessionToken(session);

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(sessionDurationMs / 1000),
  });
};

export const destroySession = async () => {
  // Remove o cookie de sessão para efetivar logout seguro no servidor.
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
};

export const getSession = async () => {
  // Lê e valida a sessão atual a partir do cookie HTTP-only do pedido.
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return parseSessionToken(token);
};
