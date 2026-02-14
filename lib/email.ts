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
  fallbackPorts: number[];
  username: string;
  password: string;
  from: string;
  secure: boolean;
  connectionTimeoutMs: number;
};

const defaultSender = "vozpublica.contacto@gmail.com";

const parseFallbackPorts = (rawFallbackPorts: string | undefined, primaryPort: number) => {
  // Interpreta lista opcional de portas de fallback para tentar outro canal SMTP quando o principal falha.
  if (!rawFallbackPorts?.trim()) {
    if (primaryPort === 587) {
      return [465];
    }

    if (primaryPort === 465) {
      return [587];
    }

    return [];
  }

  return Array.from(
    new Set(
      rawFallbackPorts
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value > 0 && value <= 65535 && value !== primaryPort)
    )
  );
};

const resolveSecureMode = (secureFromEnv: string | undefined, port: number) => {
  // Deriva se a ligação deve iniciar em TLS direto ou STARTTLS com base no porto e variável explícita.
  if (secureFromEnv === "true") {
    return true;
  }

  if (secureFromEnv === "false") {
    return false;
  }

  return port === 465;
};

const getSmtpConfig = (): SmtpConfig => {
  // Lê configuração SMTP e aplica defaults para envio via conta principal do projeto.
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const fallbackPorts = parseFallbackPorts(process.env.SMTP_FALLBACK_PORTS, port);
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

  const secure = resolveSecureMode(secureFromEnv, port);

  return {
    host,
    port,
    fallbackPorts,
    username,
    password,
    from,
    secure,
    connectionTimeoutMs: timeoutFromEnv,
  };
};

const resolveIpv4Addresses = async (host: string) =>
  new Promise<string[]>((resolve, reject) => {
    // Resolve todos os IPv4 disponíveis para permitir fallback quando um IP específico está inacessível.
    lookup(host, { family: 4, all: true }, (error, addresses) => {
      if (error || !addresses.length) {
        reject(error ?? new Error(`Não foi possível resolver IPv4 para ${host}.`));
        return;
      }

      const uniqueAddresses = Array.from(new Set(addresses.map((entry) => entry.address)));
      resolve(uniqueAddresses);
    });
  });

const encodeHeader = (value: string) => {
  // Codifica cabeçalhos em UTF-8 para preservar acentos em assuntos e remetente.
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

const normalizeLineBreaks = (value: string) => value.replace(/\r?\n/g, "\r\n");

const getSafeErrorMessage = (error: unknown, fallbackMessage: string) => {
  // Normaliza mensagens de erro para nunca devolver texto vazio nos logs e na resposta final.
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};

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

  let ipv4Addresses: string[] = [];

  try {
    ipv4Addresses = await resolveIpv4Addresses(config.host);
  } catch {
    // Mantém fallback para hostname quando a resolução manual de IPv4 falha neste ambiente.
    ipv4Addresses = [];
  }

  const connectionTargets = [...ipv4Addresses, config.host];
  const connectionPorts = [config.port, ...config.fallbackPorts];

  const connectToTarget = async (targetHost: string, targetPort: number) => {
    // Tenta conexão por destino individual para permitir múltiplas tentativas com timeout controlado.
    const shouldUseTlsFromStart = resolveSecureMode(process.env.SMTP_SECURE?.trim().toLowerCase(), targetPort);

    if (shouldUseTlsFromStart) {
      const tlsSocket = connectTls({ host: targetHost, port: targetPort, servername: config.host });

      await new Promise<void>((resolve, reject) => {
        // Escuta secureConnect para garantir que o handshake TLS inicial concluiu com sucesso.
        const onError = (error: Error) => {
          cleanup();
          reject(error);
        };

        const onTimeout = () => {
          cleanup();
          tlsSocket.destroy();
          reject(new Error(`Timeout ao conectar por TLS ao SMTP após ${config.connectionTimeoutMs}ms.`));
        };

        const onSecureConnect = () => {
          cleanup();
          resolve();
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
        tlsSocket.setTimeout(config.connectionTimeoutMs);
      });

      return tlsSocket;
    }

    const tcpSocket = connectTcp({ host: targetHost, port: targetPort });
    await waitForConnect(tcpSocket, config.connectionTimeoutMs);
    return tcpSocket;
  };

  let socket: Socket | TLSSocket | null = null;
  let connectedPort = config.port;
  const attemptErrors: string[] = [];

  for (const targetPort of connectionPorts) {
    for (const targetHost of connectionTargets) {
      try {
        socket = await connectToTarget(targetHost, targetPort);
        connectedPort = targetPort;
        break;
      } catch (error) {
        const errorMessage = getSafeErrorMessage(error, "Falha sem detalhe retornado pelo socket.");
        attemptErrors.push(`${targetHost}:${targetPort}: ${errorMessage}`);
      }
    }

    if (socket) {
      break;
    }
  }

  if (!socket) {
    const attemptsSummary = attemptErrors.length
      ? attemptErrors.join(" | ")
      : "Nenhuma tentativa de conexão SMTP foi executada.";

    const helpMessage =
      "Verifique SMTP_HOST/SMTP_PORT/SMTP_SECURE e confirme se o servidor permite tráfego de saída nessa porta.";
    throw new Error(`Falha ao enviar e-mail via SMTP (${config.host}:${config.port}): ${attemptsSummary}. ${helpMessage}`);
  }

  try {
    const greeting = await waitForResponse(socket);

    if (greeting.code >= 400) {
      throw new Error(`SMTP greeting failed: ${greeting.raw}`);
    }

    await sendCommand(socket, `EHLO ${config.host}`);

    if (!resolveSecureMode(process.env.SMTP_SECURE?.trim().toLowerCase(), connectedPort)) {
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
    const message = getSafeErrorMessage(error, "Erro desconhecido durante o envio SMTP.");
    throw new Error(`Falha ao enviar e-mail via SMTP (${config.host}:${connectedPort}): ${message}`);
  } finally {
    socket.end();
  }
};
