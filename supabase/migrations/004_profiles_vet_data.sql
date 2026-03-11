-- ============================================================
-- PawCure – Add professional vet data columns to profiles
-- ============================================================

alter table public.profiles
  add column if not exists vet_name    text,
  add column if not exists vet_license text;
