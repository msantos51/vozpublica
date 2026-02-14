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
          email_confirmed boolean not null default true,
          email_confirmation_token_hash text,
          email_confirmation_sent_at timestamptz,
          password_reset_token_hash text,
          password_reset_expires_at timestamptz,
          is_admin boolean not null default false,
          password_hash text not null,
          created_at timestamptz not null default now()
        )
      `);

      await pool.query(`
        create table if not exists polls (
          id uuid primary key default gen_random_uuid(),
          title text not null,
          description text not null,
          prompt text not null,
          options jsonb not null,
          status text not null default 'draft',
          starts_at timestamptz,
          ends_at timestamptz,
          created_by uuid references users(id),
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )
      `);

      await pool.query(`
        create table if not exists poll_votes (
          id uuid primary key default gen_random_uuid(),
          poll_id uuid not null references polls(id) on delete cascade,
          user_id uuid not null references users(id) on delete cascade,
          option_text text not null,
          created_at timestamptz not null default now(),
          unique (poll_id, user_id)
        )
      `);

      await pool.query(`
        create table if not exists contact_messages (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          email text not null,
          subject text not null,
          message text not null,
          email_delivery_status text not null default 'pending',
          email_delivery_error text,
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
      await pool.query("alter table users add column if not exists email_confirmed boolean not null default true");
      await pool.query("alter table users add column if not exists email_confirmation_token_hash text");
      await pool.query("alter table users add column if not exists email_confirmation_sent_at timestamptz");
      await pool.query("alter table users add column if not exists password_reset_token_hash text");
      await pool.query("alter table users add column if not exists password_reset_expires_at timestamptz");
      await pool.query(
        "alter table users add column if not exists is_admin boolean not null default false"
      );

      await pool.query("alter table polls add column if not exists title text");
      await pool.query("alter table polls add column if not exists description text");
      await pool.query("alter table polls add column if not exists prompt text");
      await pool.query("alter table polls add column if not exists options jsonb");
      await pool.query("alter table polls add column if not exists status text not null default 'draft'");
      await pool.query("alter table polls add column if not exists starts_at timestamptz");
      await pool.query("alter table polls add column if not exists ends_at timestamptz");
      await pool.query("alter table polls add column if not exists created_by uuid");
      await pool.query(
        "alter table polls add column if not exists created_at timestamptz not null default now()"
      );
      await pool.query(
        "alter table polls add column if not exists updated_at timestamptz not null default now()"
      );

      // Garante unicidade por NIF hash mesmo em bases de dados antigas.
      await pool.query(
        "create unique index if not exists users_national_id_hash_unique on users (national_id_hash) where national_id_hash is not null"
      );

      await pool.query(
        "create index if not exists polls_status_starts_at_idx on polls(status, starts_at)"
      );

      await pool.query("alter table poll_votes add column if not exists poll_id uuid");
      await pool.query("alter table poll_votes add column if not exists user_id uuid");
      await pool.query("alter table poll_votes add column if not exists option_text text");
      await pool.query(
        "alter table poll_votes add column if not exists created_at timestamptz not null default now()"
      );
      await pool.query(
        "create unique index if not exists poll_votes_poll_user_unique on poll_votes(poll_id, user_id)"
      );
      await pool.query("create index if not exists poll_votes_poll_id_idx on poll_votes(poll_id)");
      await pool.query(
        "create index if not exists contact_messages_created_at_idx on contact_messages(created_at desc)"
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
  params: Array<string | number | boolean | null | string[]> = []
) => {
  await initializeDatabase();
  return pool.query<Result>(text, params);
};
