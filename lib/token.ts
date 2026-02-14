import { createHash, randomBytes } from "node:crypto";

const tokenSize = 32;

export const createToken = () => {
  // Gera um token aleatório em formato hexadecimal para links sensíveis enviados por e-mail.
  return randomBytes(tokenSize).toString("hex");
};

export const hashToken = (token: string) => {
  // Faz hash SHA-256 do token para guardar apenas a versão protegida na base de dados.
  return createHash("sha256").update(token).digest("hex");
};
