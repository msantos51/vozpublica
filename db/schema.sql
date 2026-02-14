-- Cria extensões necessárias para gerar UUIDs.
create extension if not exists "pgcrypto";

-- Tabela de utilizadores com dados básicos do perfil e permissão de administração.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  full_name text not null,
  email text unique not null,
  national_id_hash text unique,
  birth_date date,
  city text,
  interest text,
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
);

-- Índice único para garantir 1 registo por pessoa (via hash do NIF).
create unique index if not exists users_national_id_hash_unique
  on users (national_id_hash)
  where national_id_hash is not null;

-- Tabela de polls para gestão pelo painel de administração.
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
);

-- Tabela com os votos reais dos utilizadores para cada poll.
create table if not exists poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  option_text text not null,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

-- Índice para acelerar consultas de agregação por votação.
create index if not exists poll_votes_poll_id_idx on poll_votes (poll_id);
