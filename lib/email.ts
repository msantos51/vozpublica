import { Buffer } from "node:buffer";
import { TLSSocket, connect } from "node:tls";

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
};

const defaultSender = "vozpublica.contacto@gmail.com";

const getSmtpConfig = (): SmtpConfig => {
  // Lê configuração SMTP e aplica defaults para envio via conta principal do projeto.
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const username = process.env.SMTP_USER?.trim() || defaultSender;
  const password = process.env.SMTP_PASS?.trim() || "";
  const from = process.env.SMTP_FROM?.trim() || defaultSender;

  if (!password) {
    throw new Error("SMTP_PASS não está definida para envio de e-mails transacionais.");
  }

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT inválida.");
  }

  return { host, port, username, password, from };
};

const encodeHeader = (value: string) => {
  // Codifica cabeçalhos em UTF-8 para preservar acentos em assuntos e remetente.
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

const normalizeLineBreaks = (value: string) => value.replace(/\r?\n/g, "\r\n");

const waitForResponse = (socket: TLSSocket) =>
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

      const isMultiline = /^\d{3}-/.test(lastLine);

      if (isMultiline) {
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

const sendCommand = async (socket: TLSSocket, command: string) => {
  // Envia comando SMTP e valida resposta de sucesso para manter o fluxo consistente.
  socket.write(`${command}\r\n`);
  const response = await waitForResponse(socket);

  if (response.code >= 400) {
    throw new Error(`SMTP command failed (${command}): ${response.raw}`);
  }

  return response;
};

export const sendEmail = async (payload: MailPayload) => {
  // Envia e-mail transacional via SMTP seguro com autenticação AUTH LOGIN.
  const config = getSmtpConfig();
  const socket = connect({ host: config.host, port: config.port, servername: config.host });

  await new Promise<void>((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  try {
    const greeting = await waitForResponse(socket);

    if (greeting.code >= 400) {
      throw new Error(`SMTP greeting failed: ${greeting.raw}`);
    }

    await sendCommand(socket, `EHLO ${config.host}`);
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
  } finally {
    socket.end();
  }
};
