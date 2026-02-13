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

  // Ignora hashes inválidos para evitar erro em contas antigas/malformadas.
  if (key.length !== keyLength * 2 || !/^[0-9a-f]+$/i.test(key)) {
    return false;
  }

  const expectedBuffer = Buffer.from(key, "hex");
  const derivedBuffer = Buffer.from(scryptSync(password, salt, keyLength));

  if (expectedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, derivedBuffer);
};
