-- Schema pour l'app de livraison de colis à Dakar
-- A exécuter sur la base Postgres (Neon)

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('client', 'livreur', 'admin')),
  nom text not null,
  telephone text not null unique,
  email text unique,
  password_hash text not null,
  zone text,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists livraisons (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references users(id),
  livreur_id uuid references users(id),
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'assignee', 'colis_recupere', 'en_livraison', 'livre', 'annule')),
  adresse_depart text not null,
  depart_lat double precision,
  depart_lng double precision,
  adresse_arrivee text not null,
  arrivee_lat double precision,
  arrivee_lng double precision,
  description text,
  destinataire_nom text not null,
  destinataire_telephone text not null,
  prix_fcfa integer,
  mode_paiement text not null default 'cash' check (mode_paiement in ('cash', 'wave', 'orange_money')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists livraison_evenements (
  id uuid primary key default gen_random_uuid(),
  livraison_id uuid not null references livraisons(id) on delete cascade,
  statut text not null,
  lat double precision,
  lng double precision,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists livreur_position (
  livreur_id uuid primary key references users(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_livraisons_client on livraisons(client_id);
create index if not exists idx_livraisons_livreur on livraisons(livreur_id);
create index if not exists idx_livraisons_statut on livraisons(statut);
create index if not exists idx_evenements_livraison on livraison_evenements(livraison_id, created_at);
