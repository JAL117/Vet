# Esquema

## Resumen

Tres tablas en `public` — `profiles`, `patients` y `clinical_records` — definidas en
[`supabase/migrations/`](../../supabase/migrations/). No hay tipos generados: los
tipos de TypeScript están escritos a mano en `src/types/` (ver
[Tipos de TypeScript](#tipos-de-typescript), donde se explica por qué eso importa).
Para las relaciones entre tablas, ver el [README](./README.md); para las políticas de
seguridad, ver [rls.md](./rls.md).

---

## `profiles` — perfil del veterinario

Migraciones [`001_profiles.sql`](../../supabase/migrations/001_profiles.sql) y
[`004_profiles_vet_data.sql`](../../supabase/migrations/004_profiles_vet_data.sql).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | FK a `auth.users(id)`, `on delete cascade` |
| `email` | `text` not null | |
| `full_name` | `text` | Se rellena desde `raw_user_meta_data` al registrarse |
| `avatar_url` | `text` | |
| `vet_name` | `text` | Nombre profesional; aparece en las recetas PDF |
| `vet_license` | `text` | Cédula profesional; aparece en las recetas PDF |
| `created_at` / `updated_at` | `timestamptz` | |

La fila se crea sola al registrarse un usuario
(ver [Triggers](./migrations.md#triggers)).

Índices: `profiles_id_idx` sobre `(id)` — la PK ya cubre las búsquedas exactas, pero
es útil para escaneos de FK.

## `patients` — pacientes

Migración [`002_patients.sql`](../../supabase/migrations/002_patients.sql).

| Grupo | Columnas |
|---|---|
| Identidad | `id` (uuid PK), `user_id` (FK `auth.users`, cascade) |
| Paciente | `name` not null, `species` not null, `breed`, `sex`, `neutered` (default false), `birth_date`, `weight_kg` `numeric(6,2)`, `color`, `microchip` |
| Propietario | `owner_name` not null, `owner_phone`, `owner_email`, `owner_address` |
| Clínico | `allergies`, `notes` |
| Timestamps | `created_at`, `updated_at` |

Los datos del propietario van **embebidos** en la fila del paciente, no en una tabla
aparte. Es una simplificación deliberada: si un propietario tiene varios pacientes,
sus datos se repiten. Separarlos requeriría una tabla `owners` y una migración.

Índices: `(user_id)`, `(user_id, lower(name))` para búsqueda por nombre,
`(user_id, species)` para el filtro por especie.

## `clinical_records` — historial clínico

Migración [`003_clinical_records.sql`](../../supabase/migrations/003_clinical_records.sql).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `patient_id` | `uuid` not null | FK a `patients(id)`, `on delete cascade` |
| `user_id` | `uuid` not null | FK a `auth.users(id)`, cascade — **denormalizado a propósito** |
| `date` | `date` not null | default `current_date` |
| `reason` | `text` | Motivo de consulta |
| `weight_kg` | `numeric(6,2)` | |
| `temperature` | `numeric(4,1)` | |
| `diagnosis`, `treatment`, `notes` | `text` | |
| `created_at` / `updated_at` | `timestamptz` | |

**Por qué `user_id` está duplicado aquí:** la política RLS lo compara directamente
contra `auth.uid()`. Sin esa columna, cada verificación tendría que hacer un JOIN a
`patients` para resolver el dueño, en cada fila y en cada query. Es denormalización
deliberada al servicio del rendimiento de RLS.

Índices: `(patient_id)`, `(user_id)`, `(patient_id, date desc)` para el listado
cronológico del historial.

---

## Tipos de TypeScript

Los tipos están **escritos a mano** en `src/types/`:

| Archivo | Contiene |
|---|---|
| `patient.ts` | `Patient`, `Species`, `Sex`, `PatientFormData`, `emptyPatientForm`, `calcAge`, `formatAge` |
| `clinicalRecord.ts` | `ClinicalRecord`, `ClinicalRecordFormData`, `emptyClinicalRecordForm`, `formatDate` |

**No existe tipo para `profiles`**: `ProfilePanel.tsx` y la página de recetas la
consultan sin tipar.

### Limitación importante

Los clientes de Supabase se crean **sin el genérico `Database`**:

```typescript
// src/lib/supabase/client.ts — sin <Database>
createBrowserClient(url, key)
```

Consecuencia: **los resultados de las queries no están verificados contra el esquema**.
Un `select("nombre")` sobre una columna que se llama `name` compila sin error y falla
en runtime. Los tipos escritos a mano describen el esquema, pero nada garantiza que
sigan coincidiendo con él.

### Mejora recomendada

Generar los tipos desde la base de datos y pasarlos al cliente:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

```typescript
import type { Database } from "@/types/database.types";
createBrowserClient<Database>(url, key);
```

A partir de ahí, las queries quedan type-checked y los desajustes salen en
`npx tsc --noEmit` en vez de en producción. Requiere regenerar el archivo tras cada
migración.

---

## Convenciones de datos

### Valores categóricos: sin restricción en la base de datos

`species` y `sex` son `text` planos. Las uniones existen **solo en TypeScript**:

```typescript
export type Species = "perro" | "gato" | "otro";
export type Sex = "macho" | "hembra" | "";
```

La base de datos acepta cualquier cadena. Los valores están en español porque son
datos ya almacenados, no identificadores de código (ver la convención de idioma en
`CLAUDE.md`).

**Si quieres reforzarlo**, la opción recomendada es `CHECK`, no `ENUM`:

```sql
alter table public.patients
  add constraint patients_species_check
  check (species in ('perro', 'gato', 'otro'));
```

`ALTER TYPE ADD VALUE` (ENUM) **no es transaccional** en PostgreSQL: si la migración
falla a medias no hay rollback. `ALTER TABLE DROP/ADD CONSTRAINT` sí lo es, lo que
hace mucho más seguro añadir o quitar valores después.

### Fechas

`date` para fechas de calendario (`birth_date`, `clinical_records.date`) y
`timestamptz` para marcas de tiempo. En TypeScript se manejan como `string` ISO
`'YYYY-MM-DD'`.

### Numéricos

`numeric(6,2)` para pesos y `numeric(4,1)` para temperatura. En los formularios viajan
como `string` (por los `<input>`) y se convierten en el submit con
`parseFloat(x) || null`.

---

## Manejo de errores

No hay helpers centralizados; cada página inspecciona el `{ error }` que devuelve
Supabase y lo mapea a un string traducido (`p.errorLoad`, `p.errorSave`).

Códigos que conviene reconocer:

| Código | Significado | Cuándo aparece |
|---|---|---|
| `PGRST116` | `.single()` sin resultados | Registro inexistente. Usa `.maybeSingle()` si el caso es válido |
| `PGRST205` | Tabla no encontrada en el schema cache | **Faltan migraciones por aplicar** (ver [verificación](./migrations.md#verificar-que-el-esquema-está-aplicado)) |
| `23505` | Violación de unique constraint | Insert duplicado |
| `42501` | Permiso denegado | Casi siempre una política [RLS](./rls.md) bloqueando, no un bug de permisos |

Referencias: [PostgREST](https://postgrest.org/en/stable/references/errors.html) ·
[PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html)
