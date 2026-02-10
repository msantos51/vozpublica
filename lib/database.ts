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

let initializationPromise: Promise<void> | null = null;

const initializeDatabase = async (): Promise<void> => {
  if (!initializationPromise) {
    // Garante que a estrutura mínima da base de dados existe antes das queries da aplicação.
    initializationPromise = (async () => {
      await pool.query('create extension if not exists "pgcrypto"');
      await pool.query(`
        create table if not exists users (
          id uuid primary key default gen_random_uuid(),
          full_name text not null,
          email text unique not null,
          city text,
          interest text,
          password_hash text not null,
          created_at timestamptz not null default now()
        )
      `);
    })().catch((error: unknown) => {
      initializationPromise = null;
      throw error;
    });
  }

  await initializationPromise;
};

// Executa queries parametrizadas para evitar SQL injection.
export const query = async <Result>(
  text: string,
  params: Array<string | number | boolean | null> = []
) => {
  await initializeDatabase();
  return pool.query<Result>(text, params);
};
