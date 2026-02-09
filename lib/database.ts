import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não está definida nas variáveis de ambiente.");
}

// Decide se deve usar SSL com base no parâmetro sslmode do URL.
const shouldUseSsl = databaseUrl.includes("sslmode=require");

// Cria um pool de ligações para reutilizar conexões com a base de dados.
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
});

// Executa queries parametrizadas para evitar SQL injection.
export const query = <Result>(
  text: string,
  params: Array<string | number | boolean | null> = []
) => pool.query<Result>(text, params);
