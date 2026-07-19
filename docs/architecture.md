# Arquitectura del sistema

Visión general de PawCure y orden de lectura sugerido. Si es tu primer contacto con el
proyecto, empieza por aquí.

## Qué es

Plataforma veterinaria construida con Next.js 16 (App Router) + React 19 + Supabase +
Tailwind v4. Interfaz bilingüe (español/inglés) con i18n propio.

Cuatro módulos funcionales:

| Módulo | Qué hace | Persiste datos |
|---|---|---|
| Calculadoras | 10 calculadoras clínicas (dosis, fluidos, nutrición…) | No |
| Pacientes | Ficha del animal y su propietario, con historial clínico | Sí |
| Recetas | Genera prescripciones en PDF y las sincroniza al historial | Sí |
| Referencia | Tablas de valores clínicos de consulta rápida | No |

## Flujo principal

```
Petición HTTP
     │
     ▼
src/proxy.ts ──────────────► updateSession()   ← TODO el gating de auth vive aquí
     │                        (refresca cookies de sesión)
     │
     ├─ sin sesión + ruta ≠ /auth/*  ──► redirect /auth/login
     ├─ con sesión + ruta = /auth/*  ──► redirect /
     │
     ▼
src/app/layout.tsx
     │
     ▼
LanguageProvider ─► AuthProvider ─► AppShell ─► Sidebar + <main>
                                                      │
                                                      ▼
                                              Página ("use client")
                                                      │
                                    createClient() dentro de useEffect
                                                      │
                                                      ▼
                                            Supabase  ── RLS filtra por user_id
```

## Dos decisiones que explican casi todo el código

Entender estas dos hace que el resto del proyecto tenga sentido.

### 1. Cliente-first: casi no hay servidor

Prácticamente **cada página es `"use client"`** y consulta Supabase desde el navegador
dentro de `useEffect`. No hay Server Components con datos, ni Server Actions, ni rutas
de API (salvo el callback de OAuth), ni capa de fetch compartida, ni caché.

Consecuencias visibles por todo el código:

- Todas las páginas de `/patients` declaran `export const dynamic = "force-dynamic"`.
- `createClient()` se llama **dentro** de efectos y handlers, nunca en el cuerpo del
  módulo (ejecutarlo en SSR rompía).
- `src/lib/supabase/server.ts` se usa en **un solo sitio**: el callback OAuth.

### 2. RLS es la única barrera de seguridad

No hay comprobaciones de autorización en el código de la aplicación. Las queries de
listado **no filtran por `user_id`** — confían en las políticas de PostgreSQL.

```typescript
// Correcto: sin .eq("user_id", ...). RLS lo hace.
const { data } = await supabase.from("patients").select("*").order("name");
```

Los `INSERT` sí deben setear `user_id` explícitamente: la política lo valida, pero no
lo rellena.

Ver [`database/rls.md`](./database/rls.md).

## Módulos

### Con ruta (espejo de `src/app/`)

| Módulo | Documentación |
|---|---|
| Autenticación | [`auth/`](./auth/README.md) |
| Calculadoras | [`calculators/`](./calculators/README.md) |
| Pacientes e historial | [`patients/`](./patients/README.md) |
| Recetas | [`prescriptions/`](./prescriptions/README.md) |
| Referencia clínica | [`reference/`](./reference/README.md) |

Sin documentación propia, a propósito: `/disclaimer` (texto legal estático) y
`/documents` (redirect a `/prescriptions`).

### Transversales

| Tema | Documentación |
|---|---|
| Esquema, RLS, migraciones | [`database/`](./database/README.md) |
| i18n y convenciones de UI | [`platform/`](./platform/README.md) |

## Orden de lectura sugerido

1. **Este documento** — el flujo y las dos decisiones de fondo.
2. [`glossary.md`](./glossary.md) — vocabulario del dominio. Corto y evita malentendidos
   caros (paciente ≠ propietario ≠ usuario).
3. [`database/README.md`](./database/README.md) — tres tablas y el modelo de seguridad.
   Todo lo que persiste pasa por aquí.
4. [`auth/README.md`](./auth/README.md) — cómo se entra a la aplicación.
5. El módulo en el que vayas a trabajar.
6. [`CONTRIBUTING.md`](./CONTRIBUTING.md) — antes de escribir documentación.

## Convenciones transversales

- **Idioma:** código, archivos y carpetas en inglés; comentarios y documentación en
  español. Detalle y excepciones en [`CLAUDE.md`](../CLAUDE.md).
- **Estilos:** Tailwind v4 CSS-first, **sin `tailwind.config`**. Tokens semánticos en
  `globals.css`. Ver [`platform/ui-conventions.md`](./platform/ui-conventions.md).
- **Textos de UI:** siempre vía i18n, nunca literales en el JSX. Ver
  [`platform/i18n.md`](./platform/i18n.md).
- **Formularios:** estado en un objeto único; los numéricos viajan como `string` y se
  convierten en el submit.

## Limitaciones conocidas del sistema

Deudas asumidas, no descuidos. Conviene conocerlas antes de construir encima:

| Limitación | Dónde |
|---|---|
| Los borrados de pacientes y expedientes son **definitivos**, sin soft delete ni auditoría | [`database/README.md`](./database/README.md) |
| Las queries **no están verificadas** contra el esquema (clientes sin genérico `Database`) | [`database/schema.md`](./database/schema.md) |
| El PDF de recetas es solo español y solo tema claro | [`prescriptions/README.md`](./prescriptions/README.md) |
| `/prescriptions` carga la tabla `patients` entera en memoria | [`prescriptions/README.md`](./prescriptions/README.md) |
| Hay componentes muertos que no se importan en ningún sitio | [`platform/ui-conventions.md`](./platform/ui-conventions.md) |

## Ver también

- [`README.md`](./README.md) — hub de navegación
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — cómo documentar
- [`CLAUDE.md`](../CLAUDE.md) — reglas para agentes de IA, comandos y trampas
