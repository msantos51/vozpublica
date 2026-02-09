-- Cria extensões necessárias para gerar UUIDs.
create extension if not exists "pgcrypto";

-- Tabela de utilizadores com dados básicos do perfil.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  city text,
  interest text,
  password_hash text not null,
  created_at timestamptz not null default now()
);
