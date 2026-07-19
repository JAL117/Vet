# Base de datos

## Resumen

PawCure usa Supabase (PostgreSQL): tres tablas en el esquema `public`, todas colgando
de `auth.users`, con aislamiento entre veterinarios garantizado por Row Level Security.
El esquema completo vive en [`supabase/migrations/`](../../supabase/migrations/) —
cuatro archivos, aplicados en orden numérico.

## Relaciones

```
auth.users
  ├── 1─1  profiles           (perfil del veterinario)
  ├── 1─N  patients           (pacientes del veterinario)
  └── 1─N  clinical_records   (denormalizado para RLS)

patients
  └── 1─N  clinical_records   (expedientes del paciente)
```

## Documentos

| Tema | Documento | Qué cubre |
|---|---|---|
| Esquema y tipos | [schema.md](./schema.md) | Las tres tablas en detalle, índices, tipos de TypeScript, convenciones de datos y manejo de errores |
| Seguridad | [rls.md](./rls.md) | Modelo RLS, políticas por tabla y operación, e implicaciones al escribir código |
| Migraciones y setup | [migrations.md](./migrations.md) | Convención de nombres, reglas al escribir SQL, triggers, setup inicial y verificación |

## Deudas conocidas

Cosas que hoy no están y conviene tener presentes:

- **Los borrados son definitivos.** `patients` y `clinical_records` se eliminan con
  `.delete()` directo. No hay soft delete (`deleted_at`) ni tabla de auditoría. Borrar
  un paciente arrastra en cascada todo su historial clínico, sin posibilidad de
  recuperación ni registro de quién lo hizo. Para un sistema de expedientes clínicos
  esto es el hueco más serio del modelo.
- **Sin tipos generados**: las queries no están verificadas contra el esquema
  (ver [Tipos de TypeScript](./schema.md#tipos-de-typescript)).
- **Sin restricciones `CHECK`** en los campos categóricos
  (ver [Convenciones de datos](./schema.md#convenciones-de-datos)).
- **Sin `profiles` tipado** en TypeScript.
- **Datos del propietario embebidos** en `patients`: se duplican entre pacientes del
  mismo dueño.

## Ver también

- [`schema.md`](./schema.md) — tablas, columnas, índices y tipos de TypeScript
- [`rls.md`](./rls.md) — políticas y modelo de seguridad
- [`migrations.md`](./migrations.md) — convenciones, triggers y setup del CLI
- [`../patients/README.md`](../patients/README.md) — consumidor principal de `patients`
- [`../patients/clinical-records.md`](../patients/clinical-records.md) — consumidor de `clinical_records`
- [`../auth/README.md`](../auth/README.md) — cómo se obtiene la sesión que RLS evalúa
