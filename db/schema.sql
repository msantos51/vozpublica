-- Cria extensões necessárias para gerar UUIDs.
create extension if not exists "pgcrypto";

-- Tabela de utilizadores com dados básicos do perfil.
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
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Índice único para garantir 1 registo por pessoa (via hash do NIF).
create unique index if not exists users_national_id_hash_unique
  on users (national_id_hash)
  where national_id_hash is not null;
