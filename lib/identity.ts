import { createHash } from "crypto";

// Normaliza o identificador para comparar sempre no mesmo formato.
export const normalizeNationalId = (value: string): string => value.replace(/\D/g, "").trim();

// Valida o formato base do NIF português (9 dígitos).
export const isValidNationalIdFormat = (value: string): boolean => /^\d{9}$/.test(value);

// Gera um hash do identificador para não guardar o dado sensível em texto simples.
export const hashNationalId = (value: string): string =>
  createHash("sha256").update(normalizeNationalId(value)).digest("hex");
