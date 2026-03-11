-- ============================================================
-- PawCure – Patients table with Row Level Security
-- Each user (vet) only sees their own patients
-- ============================================================

create table if not exists public.patients (
  -- Identity
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,

  -- Patient data
  name          text        not null,
  species       text        not null,  -- 'perro' | 'gato' | 'otro'
  breed         text,
  sex           text,                  -- 'macho' | 'hembra'
  neutered      boolean     not null default false,
  birth_date    date,
  weight_kg     numeric(6,2),
  color         text,
  microchip     text,

  -- Owner data
  owner_name    text        not null,
  owner_phone   text,
  owner_email   text,
  owner_address text,

  -- Clinical
  allergies     text,
  notes         text,

  -- Timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Indexes for RLS and common queries ────────────────────
create index if not exists patients_user_id_idx   on public.patients (user_id);
create index if not exists patients_name_idx      on public.patients (user_id, lower(name));
create index if not exists patients_species_idx   on public.patients (user_id, species);

-- ── Row Level Security ────────────────────────────────────
alter table public.patients enable row level security;

-- SELECT: (select auth.uid()) cached once per query for performance
create policy "patients_select_own" on public.patients
  for select
  using ((select auth.uid()) = user_id);

create policy "patients_insert_own" on public.patients
  for insert
  with check ((select auth.uid()) = user_id);

create policy "patients_update_own" on public.patients
  for update
  using ((select auth.uid()) = user_id);

create policy "patients_delete_own" on public.patients
  for delete
  using ((select auth.uid()) = user_id);

-- ── updated_at trigger ────────────────────────────────────
create or replace trigger patients_updated_at
  before update on public.patients
  for each row
  execute function public.set_updated_at();
