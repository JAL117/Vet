# Historial clínico

## Resumen

Registros de consulta (fecha, motivo, peso, temperatura, diagnóstico, tratamiento, notas) asociados a un paciente. Viven en la tabla `clinical_records` y se gestionan desde las subrutas `/patients/[id]/history/*`. Un registro también puede nacer desde el generador de recetas (ver [Ver también](#ver-también)).

## Flujo

1. **Listar** — `/patients/[id]/history` carga todos los registros del paciente (`eq("patient_id", id)`, orden `date desc`). El detalle del paciente (`/patients/[id]`) muestra además los 3 más recientes.
2. **Crear** — `/patients/[id]/history/new` renderiza `ClinicalRecordForm`; al enviar, la página hace el INSERT con `patient_id`, `user_id` (del usuario autenticado) y los campos mapeados (`"" → null`, `parseFloat` para `weight_kg`/`temperature`), y redirige al listado.
3. **Ver / editar** — `/patients/[id]/history/[recordId]` muestra el detalle; el modo edición reutiliza `ClinicalRecordForm` con `initialData` y hace el UPDATE en línea (sin cambiar de ruta).
4. **Borrar** — misma página de detalle, con confirmación en dos pasos. DELETE definitivo.

## Modelo de datos

Tabla `clinical_records` ([`../../supabase/migrations/003_clinical_records.sql`](../../supabase/migrations/003_clinical_records.sql)):

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()`. |
| `patient_id` | `uuid` | FK a `patients(id)` `on delete cascade`: borrar el paciente borra su historial. |
| `user_id` | `uuid` | FK a `auth.users(id)`; denormalizado (ver decisiones). |
| `date` | `date` | `not null`, default `current_date`. |
| `reason`, `diagnosis`, `treatment`, `notes` | `text` | Opcionales. |
| `weight_kg` | `numeric(6,2)` | Opcional. |
| `temperature` | `numeric(4,1)` | Opcional. |
| `created_at`, `updated_at` | `timestamptz` | Trigger `clinical_records_updated_at` mantiene `updated_at`. |

RLS activado con una política por operación, todas `(select auth.uid()) = user_id`. Índices por `patient_id`, por `user_id` y compuesto `(patient_id, date desc)` para el listado cronológico.

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| [`../../src/app/patients/[id]/history/page.tsx`](../../src/app/patients/%5Bid%5D/history/page.tsx) | Listado cronológico de registros del paciente. |
| [`../../src/app/patients/[id]/history/new/page.tsx`](../../src/app/patients/%5Bid%5D/history/new/page.tsx) | Alta de registro; hace el INSERT y redirige al listado. |
| [`../../src/app/patients/[id]/history/[recordId]/page.tsx`](../../src/app/patients/%5Bid%5D/history/%5BrecordId%5D/page.tsx) | Detalle, edición en línea y borrado de un registro. |
| [`../../src/components/patients/ClinicalRecordForm.tsx`](../../src/components/patients/ClinicalRecordForm.tsx) | Formulario compartido alta/edición; puro UI, recibe `onSubmit`. |
| [`../../src/components/patients/ClinicalRecordSkeleton.tsx`](../../src/components/patients/ClinicalRecordSkeleton.tsx) | Skeleton de carga (listado, detalle y tarjeta en el detalle del paciente). |
| [`../../src/types/clinicalRecord.ts`](../../src/types/clinicalRecord.ts) | Tipos `ClinicalRecord` / `ClinicalRecordFormData`, `emptyClinicalRecordForm` (fecha default = hoy) y `formatDate` (DD/MM/YYYY). |

## Decisiones de diseño

- **`user_id` está denormalizado en `clinical_records`** aunque ya se puede deducir vía `patients.user_id`. El motivo es RLS: la política compara la columna directo contra `auth.uid()`; sin ella, cada verificación de fila exigiría un JOIN (subquery) a `patients` por fila, encareciendo todas las queries del historial. El costo es que el INSERT debe setear `user_id` explícitamente.
- **Mismo patrón de formularios que pacientes**: `ClinicalRecordForm` no toca Supabase; la página dueña hace el insert/update y el mapeo string→null/parseFloat. La edición ocurre en la propia página de detalle (toggle `isEditing`), no en una ruta `/edit` aparte.
- **Las queries no filtran por `user_id`**: filtran por `patient_id` y delegan el aislamiento por veterinario a RLS.
- **Borrado en cascada desde el paciente**: `patient_id ... on delete cascade` hace que eliminar un paciente arrastre todo su historial, sin lógica de aplicación. El borrado individual de un registro también es definitivo.
- Todas las páginas del segmento declaran `export const dynamic = "force-dynamic"` y llaman `createClient()` dentro de efectos/handlers, por las mismas razones documentadas en el [README](./README.md#decisiones-de-diseño).

## Ver también

- [README.md](./README.md) — gestión de pacientes (tabla `patients`, rutas padre).
- [`../prescriptions/README.md`](../prescriptions/README.md) — generar una receta con un paciente registrado seleccionado inserta una fila en `clinical_records` (el detalle de ese flujo se documenta ahí, no aquí).
- [`../database/rls.md`](../database/rls.md) — las políticas `(select auth.uid()) = user_id` y por qué se evalúan una vez por query.
- [`../database/schema.md`](../database/schema.md) — definición completa de la tabla `clinical_records`.
