# Plataforma (transversal)

Documentación de lo que atraviesa toda la app y no pertenece a ninguna ruta: internacionalización y convenciones de UI/estilado.

| Doc | Qué cubre |
|---|---|
| [i18n.md](./i18n.md) | Sistema propio de traducciones ES/EN: contexto React, `localStorage`, `Translations = typeof es` y traducciones que son funciones. |
| [ui-conventions.md](./ui-conventions.md) | Tailwind v4 CSS-first (sin `tailwind.config`), tokens semánticos de `globals.css`, dark mode por clase, el shell `AppShell`/`Sidebar` y componentes muertos a evitar. |

Para la capa de datos (Supabase, migraciones, RLS) ver [`../database/README.md`](../database/README.md).

## Ver también

- [`i18n.md`](./i18n.md) — sistema de traducciones
- [`ui-conventions.md`](./ui-conventions.md) — tokens de tema, dark mode y shell
- [`../database/README.md`](../database/README.md) — capa de datos
- [`../architecture.md`](../architecture.md) — visión general del sistema
