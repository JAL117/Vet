create table if not exists public.clinical_records (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.patients(id) on delete cascade,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  date          date        not null default current_date,
  reason        text,
  weight_kg     numeric(6,2),
  temperature   numeric(4,1),
  diagnosis     text,
  treatment     text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists clinical_records_patient_id_idx on public.clinical_records (patient_id);
create index if not exists clinical_records_user_id_idx on public.clinical_records (user_id);
create index if not exists clinical_records_date_idx on public.clinical_records (patient_id, date desc);

alter table public.clinical_records enable row level security;

create policy "records_select_own" on public.clinical_records for select using ((select auth.uid()) = user_id);
create policy "records_insert_own" on public.clinical_records for insert with check ((select auth.uid()) = user_id);
create policy "records_update_own" on public.clinical_records for update using ((select auth.uid()) = user_id);
create policy "records_delete_own" on public.clinical_records for delete using ((select auth.uid()) = user_id);

create or replace trigger clinical_records_updated_at
  before update on public.clinical_records
  for each row execute function public.set_updated_at();
