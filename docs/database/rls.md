# Seguridad: RLS es la única barrera

## Resumen

**El aislamiento entre veterinarios lo garantiza exclusivamente Row Level Security.**
No hay comprobaciones de autorización en el código de la aplicación. Las tres tablas
tienen RLS habilitado con una política por operación, todas con el mismo predicado:
`(select auth.uid()) = user_id` (o `= id` en `profiles`).

---

## Por qué el código no filtra por usuario

Esto es una consecuencia directa de la arquitectura: la app es *client-first* y
consulta Supabase desde el navegador con la clave publicable. Las queries de listado
**no filtran por `user_id`** — confían en que la política lo haga:

```typescript
// src/app/patients/page.tsx — sin .eq("user_id", ...), y es correcto
const { data } = await supabase.from("patients").select("*").order("name");
```

## Políticas por tabla y operación

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | `profiles_select_own` | `profiles_insert_own` | `profiles_update_own` | ❌ (no existe) |
| `patients` | `patients_select_own` | `patients_insert_own` | `patients_update_own` | `patients_delete_own` |
| `clinical_records` | `records_select_own` | `records_insert_own` | `records_update_own` | `records_delete_own` |

`profiles` **no tiene política DELETE**: no hay forma de borrar un perfil desde el
cliente (la fila cae en cascada solo si se elimina el usuario en `auth.users`).

Todas siguen el mismo predicado, con `auth.uid()` **envuelto en un SELECT**:

```sql
create policy "patients_select_own" on public.patients
  for select
  using ((select auth.uid()) = user_id);
```

> **Por qué el `(select ...)`:** envolver `auth.uid()` en un subquery hace que Postgres
> lo evalúe **una vez por query** en lugar de una vez por fila. En tablas con muchos
> registros la diferencia es grande. Mantén este patrón al escribir políticas nuevas.

En `clinical_records` la política compara contra un `user_id` **denormalizado a
propósito** para evitar un JOIN a `patients` por fila (ver
[schema.md](./schema.md#clinical_records--historial-clínico)).

## Implicaciones al escribir código

- **En los `INSERT` sí hay que setear `user_id` explícitamente.** La política de insert
  lo valida, pero no lo rellena. Se obtiene con `supabase.auth.getUser()`.
- **Nunca uses la `secret key`** (`sb_secret_…`, antes `service_role`) en el cliente:
  omite RLS por completo. Solo va la clave publicable, y solo esa.
- **Si añades una tabla, RLS no viene activado por defecto.** Una tabla sin
  `enable row level security` queda legible por cualquier usuario autenticado.

Un error `42501` (permiso denegado) casi siempre es una política RLS bloqueando, no un
bug de permisos (ver [manejo de errores](./schema.md#manejo-de-errores)).
