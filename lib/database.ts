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
          first_name text not null,
          last_name text not null,
          full_name text not null,
          email text unique not null,
          national_id_hash text unique,
          birth_date date,
          city text,
          gender text,
          education_level text,
          profile_completed boolean not null default false,
          password_hash text not null,
          created_at timestamptz not null default now()
        )
      `);

      // Mantém compatibilidade com bases de dados criadas antes desta versão.
      await pool.query("alter table users add column if not exists first_name text");
      await pool.query("alter table users add column if not exists last_name text");
      await pool.query("alter table users add column if not exists full_name text");
      await pool.query("alter table users add column if not exists national_id_hash text");
      await pool.query("alter table users add column if not exists birth_date date");
      await pool.query("alter table users add column if not exists city text");
      await pool.query("alter table users add column if not exists gender text");
      await pool.query("alter table users add column if not exists education_level text");
      await pool.query(
        "alter table users add column if not exists profile_completed boolean not null default false"
      );

      // Garante unicidade por NIF hash mesmo em bases de dados antigas.
      await pool.query(
        "create unique index if not exists users_national_id_hash_unique on users (national_id_hash) where national_id_hash is not null"
      );

      // Converte contas antigas para o novo formato de nome para evitar dados incompletos.
      await pool.query(`
        update users
        set
          first_name = coalesce(nullif(first_name, ''), split_part(full_name, ' ', 1), 'Utilizador'),
          last_name = coalesce(
            nullif(last_name, ''),
            nullif(trim(regexp_replace(full_name, '^\\S+\\s*', '')), ''),
            'VozPública'
          ),
          full_name = trim(
            coalesce(nullif(full_name, ''), '') ||
            case
              when coalesce(nullif(first_name, ''), '') <> '' and coalesce(nullif(last_name, ''), '') <> ''
                then ''
              when coalesce(nullif(first_name, ''), '') <> ''
                then ' ' || coalesce(nullif(last_name, ''), 'VozPública')
              when coalesce(nullif(last_name, ''), '') <> ''
                then coalesce(nullif(first_name, ''), 'Utilizador') || ' '
              else 'Utilizador VozPública'
            end
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
