import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const saltLength = 16;
const keyLength = 64;

// Gera um hash seguro a partir da senha usando scrypt e um salt aleatório.
export const hashPassword = (password: string) => {
  const salt = randomBytes(saltLength).toString("hex");
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");
  return `${salt}:${derivedKey}`;
};

// Compara a senha recebida com o hash guardado no banco de dados.
export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");
  return timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derivedKey, "hex"));
};
