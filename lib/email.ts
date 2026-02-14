import { Buffer } from "node:buffer";

import { lookup } from "node:dns";

import { Socket, connect as connectTcp } from "node:net";
import { TLSSocket, connect as connectTls } from "node:tls";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  secure: boolean;
  connectionTimeoutMs: number;
};

const defaultSender = "vozpublica.contacto@gmail.com";

const getSmtpConfig = (): SmtpConfig => {
  // Lê configuração SMTP e aplica defaults para envio via conta principal do projeto.
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const username = process.env.SMTP_USER?.trim() || defaultSender;
  const password = process.env.SMTP_PASS?.trim() || "";
  const from = process.env.SMTP_FROM?.trim() || defaultSender;
  const secureFromEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const timeoutFromEnv = Number(process.env.SMTP_CONNECTION_TIMEOUT_MS?.trim() || "10000");

  if (!password) {
    throw new Error("SMTP_PASS não está definida para envio de e-mails transacionais.");
  }

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT inválida.");
  }

  if (!Number.isFinite(timeoutFromEnv) || timeoutFromEnv <= 0) {
    throw new Error("SMTP_CONNECTION_TIMEOUT_MS inválida.");
  }

  const secure =
    secureFromEnv === "true" ? true : secureFromEnv === "false" ? false : port === 465;

  return { host, port, username, password, from, secure, connectionTimeoutMs: timeoutFromEnv };
};

const resolveIpv4Address = async (host: string) =>
  new Promise<string>((resolve, reject) => {
    // Resolve explicitamente IPv4 para reduzir falhas em ambientes com rota IPv6 instável.
    lookup(host, { family: 4, all: false }, (error, address) => {
      if (error || !address) {
        reject(error ?? new Error(`Não foi possível resolver IPv4 para ${host}.`));
        return;
      }

      resolve(address);
    });
  });

const encodeHeader = (value: string) => {
  // Codifica cabeçalhos em UTF-8 para preservar acentos em assuntos e remetente.
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

const normalizeLineBreaks = (value: string) => value.replace(/\r?\n/g, "\r\n");

const waitForResponse = (socket: Socket) =>
  new Promise<{ code: number; raw: string }>((resolve, reject) => {
    const chunks: string[] = [];

    const onData = (buffer: Buffer) => {
      chunks.push(buffer.toString("utf8"));
      const combined = chunks.join("");
      const lines = combined.split("\r\n").filter(Boolean);
      const lastLine = lines.at(-1);

      if (!lastLine || !/^\d{3}[\s-]/.test(lastLine)) {
        return;
      }

      if (/^\d{3}-/.test(lastLine)) {
        return;
      }

      cleanup();
      resolve({ code: Number(lastLine.slice(0, 3)), raw: combined });
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });

const waitForConnect = (socket: Socket, timeoutMs: number) =>
  new Promise<void>((resolve, reject) => {
    // Garante timeout explícito de conexão para evitar espera indefinida quando SMTP está indisponível.
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      socket.destroy();
      reject(new Error(`Timeout ao conectar ao servidor SMTP após ${timeoutMs}ms.`));
    };

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      socket.off("error", onError);
      socket.off("timeout", onTimeout);
      socket.off("connect", onConnect);
      socket.setTimeout(0);
    };

    socket.once("error", onError);
    socket.once("timeout", onTimeout);
    socket.once("connect", onConnect);
    socket.setTimeout(timeoutMs);
  });

const upgradeToTls = (socket: Socket, host: string, timeoutMs: number) =>
  new Promise<TLSSocket>((resolve, reject) => {
    // Atualiza conexão SMTP plaintext para TLS via STARTTLS sem abrir um novo socket.
    const tlsSocket = connectTls({ socket, servername: host });

    const onSecureConnect = () => {
      cleanup();
      resolve(tlsSocket);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      tlsSocket.destroy();
      reject(new Error(`Timeout no handshake TLS após ${timeoutMs}ms.`));
    };

    const cleanup = () => {
      tlsSocket.off("secureConnect", onSecureConnect);
      tlsSocket.off("error", onError);
      tlsSocket.off("timeout", onTimeout);
      tlsSocket.setTimeout(0);
    };

    tlsSocket.once("secureConnect", onSecureConnect);
    tlsSocket.once("error", onError);
    tlsSocket.once("timeout", onTimeout);
    tlsSocket.setTimeout(timeoutMs);
  });

const sendCommand = async (socket: Socket, command: string) => {
  // Envia comando SMTP e valida resposta de sucesso para manter o fluxo consistente.
  socket.write(`${command}\r\n`);
  const response = await waitForResponse(socket);

  if (response.code >= 400) {
    throw new Error(`SMTP command failed (${command}): ${response.raw}`);
  }

  return response;
};

export const sendEmail = async (payload: MailPayload) => {
  // Envia e-mail transacional via SMTP, suportando TLS direto (465) e STARTTLS (587).
  const config = getSmtpConfig();

  const smtpIpv4 = await resolveIpv4Address(config.host);
  let socket: Socket | TLSSocket;

  if (config.secure) {
    socket = connectTls({ host: smtpIpv4, port: config.port, servername: config.host });

    await new Promise<void>((resolve, reject) => {
      // Escuta secureConnect para garantir que o handshake TLS inicial concluiu com sucesso.
      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const onTimeout = () => {
        cleanup();
        socket.destroy();
        reject(new Error(`Timeout ao conectar por TLS ao SMTP após ${config.connectionTimeoutMs}ms.`));
      };

      const onSecureConnect = () => {
        cleanup();
        resolve();
      };

      const cleanup = () => {
        socket.off("secureConnect", onSecureConnect);
        socket.off("error", onError);
        socket.off("timeout", onTimeout);
        socket.setTimeout(0);
      };

      socket.once("secureConnect", onSecureConnect);
      socket.once("error", onError);
      socket.once("timeout", onTimeout);
      socket.setTimeout(config.connectionTimeoutMs);
    });
  } else {

    socket = connectTcp({ host: smtpIpv4, port: config.port });

    await waitForConnect(socket, config.connectionTimeoutMs);
  }

  try {
    const greeting = await waitForResponse(socket);

    if (greeting.code >= 400) {
      throw new Error(`SMTP greeting failed: ${greeting.raw}`);
    }

    await sendCommand(socket, `EHLO ${config.host}`);

    if (!config.secure) {
      await sendCommand(socket, "STARTTLS");
      socket = await upgradeToTls(socket, config.host, config.connectionTimeoutMs);
      await sendCommand(socket, `EHLO ${config.host}`);
    }

    await sendCommand(socket, "AUTH LOGIN");
    await sendCommand(socket, Buffer.from(config.username).toString("base64"));
    await sendCommand(socket, Buffer.from(config.password).toString("base64"));
    await sendCommand(socket, `MAIL FROM:<${config.from}>`);
    await sendCommand(socket, `RCPT TO:<${payload.to}>`);
    await sendCommand(socket, "DATA");

    const htmlContent = normalizeLineBreaks(payload.html);
    const message = [
      `From: VozPublica <${config.from}>`,
      `To: <${payload.to}>`,
      `Subject: ${encodeHeader(payload.subject)}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
      "",
      htmlContent,
      ".",
      "",
    ].join("\r\n");

    socket.write(message);
    const sendResult = await waitForResponse(socket);

    if (sendResult.code >= 400) {
      throw new Error(`SMTP DATA failed: ${sendResult.raw}`);
    }

    await sendCommand(socket, "QUIT");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    throw new Error(`Falha ao enviar e-mail via SMTP (${config.host}:${config.port}): ${message}`);
  } finally {
    socket.end();
  }
};
