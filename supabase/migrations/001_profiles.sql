-- ============================================================
-- VetCalc – Profiles table with Row Level Security
-- Best practices: RLS enabled, auth.uid() wrapped in SELECT
-- for performance (cached once per query, not per row)
-- ============================================================

create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable RLS — database-enforced tenant isolation
alter table public.profiles enable row level security;

-- SELECT: users can only read their own profile
create policy "profiles_select_own" on public.profiles
  for select
  using ((select auth.uid()) = id);

-- INSERT: users can only insert their own profile row
create policy "profiles_insert_own" on public.profiles
  for insert
  with check ((select auth.uid()) = id);

-- UPDATE: users can only update their own profile
create policy "profiles_update_own" on public.profiles
  for update
  using ((select auth.uid()) = id);

-- Index for RLS performance on user_id lookups
-- (PK already covers exact lookups, but useful for FK scans)
create index if not exists profiles_id_idx on public.profiles (id);

-- ============================================================
-- Trigger: auto-create profile row on new user signup
-- security definer + empty search_path for safety
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================
-- Trigger: keep updated_at current
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
