# Migraciones y setup

## Resumen

El esquema vive en [`supabase/migrations/`](../../supabase/migrations/) como cuatro
archivos SQL con **prefijo numérico secuencial** (no timestamps), idempotentes y con
RLS explícito. Aquí están la convención de nombres, las reglas al escribir SQL, los
triggers, el setup inicial con el CLI y cómo verificar que el esquema está aplicado.

---

## Convención de nombres

Este proyecto usa **prefijo numérico secuencial**, no el timestamp que genera el CLI
por defecto:

```
supabase/migrations/
  001_profiles.sql
  002_patients.sql
  003_clinical_records.sql
  004_profiles_vet_data.sql
```

Al crear una migración nueva, nómbrala `005_descripcion_corta.sql` y mantén la serie.
Si usas `supabase migration new`, renombra el archivo generado para respetar la
convención.

## Reglas al escribir SQL

- **Idempotencia parcial:** usa `create table if not exists`, `create index if not exists`,
  `add column if not exists` y `create or replace`. Las migraciones existentes lo hacen
  para tablas, índices, columnas, funciones y triggers.

  > ⚠️ **Las políticas RLS no son idempotentes.** PostgreSQL no admite
  > `create policy if not exists`, y las 11 políticas actuales se crean con `create policy`
  > a secas, sin un `drop policy if exists` previo. **Reaplicar cualquiera de las
  > migraciones 001, 002 o 003 falla** con `42710: policy ... already exists` en la primera
  > política. Al escribir una migración nueva con políticas, antepón
  > `drop policy if exists "<nombre>" on <tabla>;` si quieres que sea reaplicable.
- **Índice para cada FK que se consulte**, en especial las columnas que aparecen en
  políticas [RLS](./rls.md).
- **RLS explícito**: `enable row level security` más una política por operación.
- **Sin `DROP` destructivos** sin plan de migración de datos: aquí hay expedientes
  clínicos.

### Si algún día añades funciones con permisos

Escribe `GRANT`/`REVOKE`/`NOTIFY` como **statements sueltos** después de la función,
nunca envueltos en un bloque `DO $$ ... $$`. Con ciertas versiones del CLI, el
splitter manda el archivo como un único *prepared statement* y Postgres lo rechaza con
`ERROR: cannot insert multiple commands into a prepared statement (SQLSTATE 42601)`.
Es una regla preventiva: el patrón de statements sueltos nunca lo dispara.

```sql
create or replace function mi_rpc(...) ... as $$
  -- cuerpo
$$;

revoke all on function mi_rpc(...) from public;
grant execute on function mi_rpc(...) to authenticated;
```

---

## Triggers

Dos funciones, ambas definidas en
[`001_profiles.sql`](../../supabase/migrations/001_profiles.sql). Las dos llevan
`set search_path = ''`: el `search_path` vacío evita que un esquema malicioso en el
path secuestre la resolución de nombres.

### `handle_new_user()` — crear perfil al registrarse

`AFTER INSERT` sobre `auth.users` (trigger `on_auth_user_created`). Inserta la fila
correspondiente en `profiles`, tomando `full_name` de `raw_user_meta_data`. Usa
`on conflict (id) do nothing`, así que es idempotente.

Está declarada `security definer`: necesita permisos elevados para escribir en
`public.profiles` desde el esquema `auth`. Por eso el `search_path` vacío es
especialmente importante aquí — la función corre con privilegios del dueño.

**Consecuencia práctica:** si esta migración no está aplicada, el registro de usuarios
parece funcionar (se crea en `auth.users`) pero el perfil nunca existe, y la app falla
más adelante al leerlo.

### `set_updated_at()` — mantener `updated_at`

`BEFORE UPDATE`. Asigna `now()` a `updated_at`. Está enganchada a las tres tablas
mediante los triggers `profiles_updated_at`, `patients_updated_at` y
`clinical_records_updated_at`.

**Al crear una tabla nueva**, añade la columna y engancha el trigger:

```sql
-- La tabla necesita la columna
updated_at timestamptz not null default now()

-- Y el trigger, reutilizando la función existente
create or replace trigger <tabla>_updated_at
  before update on public.<tabla>
  for each row
  execute function public.set_updated_at();
```

---

## Setup inicial

El CLI de Supabase **no es dependencia del proyecto**; se instala aparte
(`brew install supabase/tap/supabase` o `npx supabase`).

1. Crea el proyecto en [supabase.com](https://supabase.com).
2. Copia las credenciales a `.env.local` (plantilla en `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   Necesitas `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   (Dashboard → Project Settings → API Keys).
3. Vincula el proyecto:
   ```bash
   supabase login
   supabase link --project-ref TU_PROJECT_REF
   ```
4. Aplica las migraciones:
   ```bash
   supabase db push
   ```

## Comandos

| Comando | Descripción |
|---|---|
| `supabase link --project-ref <ref>` | Vincular el proyecto local al remoto |
| `supabase db push` | Aplicar migraciones pendientes |
| `supabase migration list` | Ver estado local vs remoto |
| `supabase db diff` | Ver diferencias pendientes |
| `supabase migration new <nombre>` | Crear migración (recuerda renombrar al prefijo numérico) |

> No hay scripts `db:*` en `package.json`; los comandos se ejecutan directamente
> contra el CLI.

> **No hay `supabase/seed.sql`.** El proyecto no necesita datos de catálogo: las
> categorías de calculadoras y los valores de referencia viven en el código
> (`src/lib/calculators.ts`, `src/app/reference/page.tsx`), no en la base de datos.

## Verificar que el esquema está aplicado

Un proyecto recién creado tiene `auth` funcionando pero **ninguna de las tres tablas**.
El síntoma es que login y registro funcionan, pero cualquier pantalla de pacientes,
historial o recetas falla. Para comprobarlo sin abrir el dashboard:

```bash
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/patients?select=id&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
```

- `[]` → la tabla existe y RLS filtra correctamente (sin sesión no hay filas). Todo bien.
- `{"code":"PGRST205", ...}` → **la tabla no existe**: faltan las migraciones.
