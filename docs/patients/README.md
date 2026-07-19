# Pacientes

Módulo de gestión de pacientes de PawCure: CRUD completo de mascotas (con los datos del propietario embebidos) sobre la tabla `patients` de Supabase, aislado por veterinario mediante RLS.

## Arquitectura

```
Navegador (client components, "use client")
│
├── /patients ──────────────► page.tsx (lista + búsqueda + filtro por especie)
├── /patients/new ──────────► page.tsx ──► PatientForm (onSubmit ← la página)
├── /patients/[id] ─────────► page.tsx (detalle + últimos 3 registros + borrado)
└── /patients/[id]/edit ────► page.tsx ──► PatientForm (initialData, isEdit)
                                   │
                                   ▼
                    createClient()  (src/lib/supabase/client.ts)
                    llamado DENTRO de useEffect / handlers
                                   │
                                   ▼
                    Supabase ── tabla `patients` (RLS: auth.uid() = user_id)
                                   │ on delete cascade
                                   ▼
                              `clinical_records`  (ver clinical-records.md)
```

## Rutas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/patients` | [`../../src/app/patients/page.tsx`](../../src/app/patients/page.tsx) | Lista de pacientes con búsqueda por nombre/propietario y filtro por especie (`perro`/`gato`/`otro`); ordena por nombre. |
| `/patients/new` | [`../../src/app/patients/new/page.tsx`](../../src/app/patients/new/page.tsx) | Alta de paciente; hace el INSERT (con `user_id` explícito) y redirige al detalle. |
| `/patients/[id]` | [`../../src/app/patients/[id]/page.tsx`](../../src/app/patients/%5Bid%5D/page.tsx) | Detalle: datos del paciente, del propietario, info clínica, últimos 3 registros del historial y zona de peligro (borrado). |
| `/patients/[id]/edit` | [`../../src/app/patients/[id]/edit/page.tsx`](../../src/app/patients/%5Bid%5D/edit/page.tsx) | Edición; convierte la fila a `PatientFormData` (`toFormData`) y hace el UPDATE. |
| `/patients/[id]/history/*` | — | Historial clínico; documentado en [clinical-records.md](./clinical-records.md). |

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| [`../../src/app/patients/layout.tsx`](../../src/app/patients/layout.tsx) | Layout passthrough; declara `dynamic = "force-dynamic"` para todo el segmento. |
| [`../../src/components/patients/PatientForm.tsx`](../../src/components/patients/PatientForm.tsx) | Formulario compartido de alta/edición (3 secciones: paciente, propietario, clínica). No sabe de Supabase: recibe `onSubmit`. |
| [`../../src/components/patients/PatientListSkeleton.tsx`](../../src/components/patients/PatientListSkeleton.tsx) | Skeleton de carga de la lista. |
| [`../../src/components/patients/PatientDetailSkeleton.tsx`](../../src/components/patients/PatientDetailSkeleton.tsx) | Skeleton de carga del detalle (también usado en edición). |
| [`../../src/types/patient.ts`](../../src/types/patient.ts) | Tipos `Patient` (fila BD) y `PatientFormData` (estado del form: strings salvo `neutered`, que es `boolean`), `emptyPatientForm`, y helpers `calcAge`/`formatAge`. |
| [`../../supabase/migrations/002_patients.sql`](../../supabase/migrations/002_patients.sql) | Tabla `patients`, índices, políticas RLS por operación y trigger `updated_at`. |

## Decisiones de diseño

- **Todas las páginas declaran `export const dynamic = "force-dynamic"`** (y el `layout.tsx` del segmento también). El prerender estático rompía en build: estas páginas dependen de la sesión de Supabase del navegador y no tienen versión estática válida.
- **`createClient()` se llama dentro de efectos y handlers**, nunca en el cuerpo del módulo ni del componente. Instanciarlo a nivel de módulo rompía en SSR (el cliente de navegador necesita `window`/cookies que no existen al evaluar el módulo en el servidor).
- **Las queries NO filtran por `user_id`**: los SELECT/UPDATE/DELETE confían en las políticas RLS (`(select auth.uid()) = user_id`) para el aislamiento por veterinario. Los INSERT sí setean `user_id` explícitamente porque la política `with check` lo exige y la columna es `not null` sin default.
- **Los datos del propietario van embebidos** en la fila del paciente (`owner_name`, `owner_phone`, `owner_email`, `owner_address`), no en una tabla aparte. Se acepta la duplicación entre pacientes del mismo dueño a cambio de un modelo y un formulario más simples, sin JOINs.
- **Patrón de formularios**: `PatientForm` es puro UI y recibe `onSubmit`; la página dueña de la ruta hace el insert/update y mapea el estado del form al payload de BD — `"" → null` para opcionales y `parseFloat` para `weight_kg`. Todos los campos son `string` salvo `neutered` (`boolean`), que pasa directo sin conversión. Así el mismo componente sirve para alta y edición.
- **El borrado es definitivo** (`DELETE` real) y arrastra en cascada el historial clínico (`clinical_records.patient_id ... on delete cascade`). No hay soft delete ni auditoría; la única protección es la confirmación en dos pasos de la UI.

## Ver también

- [clinical-records.md](./clinical-records.md) — historial clínico del paciente (subrutas `/patients/[id]/history/*`).
- [`../prescriptions/README.md`](../prescriptions/README.md) — generador de recetas; al usar un paciente registrado escribe en su historial.
- [`../database/rls.md`](../database/rls.md) — por qué las queries no filtran por `user_id` y cómo funcionan las políticas.
- [`../database/schema.md`](../database/schema.md) — columnas e índices de la tabla `patients`.
