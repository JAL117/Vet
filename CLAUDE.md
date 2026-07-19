# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

> **La documentación detallada vive en [`docs/`](docs/README.md).** Este archivo cubre
> reglas, comandos y trampas; el detalle de cada módulo está en su documentación.
> Antes de trabajar en un módulo, lee su doc: `src/app/<módulo>` → `docs/<módulo>/README.md`.

## Documentación

> ### ⚠️ Regla obligatoria en TODA tarea
>
> **Antes de tocar código: lee la documentación del módulo. Al terminar: actualízala.**
>
> No es opcional ni depende del tamaño del cambio. La documentación solo sirve si dice
> la verdad; un doc desactualizado es peor que no tenerlo, porque induce a error a quien
> lo lee —persona o agente.

### Flujo obligatorio

**1. Antes de empezar** — localiza y lee el doc del módulo que vas a tocar:

| Vas a tocar | Lee primero |
|---|---|
| `src/app/<módulo>/` | `docs/<módulo>/README.md` |
| `supabase/migrations/` o queries | [`docs/database/`](docs/database/README.md) |
| `src/lib/i18n/` o `src/components/` | [`docs/platform/`](docs/platform/README.md) |
| No sabes por dónde empezar | [`docs/architecture.md`](docs/architecture.md) |

Presta atención a *Decisiones de diseño* y *Deudas conocidas*: recogen decisiones
deliberadas que parecen errores. **No las "corrijas" sin entender el porqué.**

**2. Al terminar** — revisa si tu cambio invalidó algo de lo documentado:

- [ ] ¿Cambiaron rutas, archivos o responsabilidades? → actualiza las tablas *Rutas* y
      *Archivos clave*.
- [ ] ¿Tomaste una decisión no evidente en el código? → añádela a *Decisiones de diseño*.
- [ ] ¿Resolviste o creaste una limitación? → actualiza *Deudas conocidas*.
- [ ] ¿Introdujiste un término de dominio? → añádelo a [`docs/glossary.md`](docs/glossary.md).
- [ ] ¿Los paths que citaste siguen existiendo? → verifícalos con `ls`.
- [ ] ¿El cambio afecta a otro módulo? → actualiza también su doc y el enlace cruzado.

**3. En el mismo commit** — código y documentación viajan juntos. Un commit que cambia
comportamiento documentado sin tocar el doc está incompleto.

### Reglas de contenido

- **Cuándo documentar**: features nuevas o cambios que modifiquen un flujo del sistema
  (flujos de datos, decisiones arquitectónicas).
- **Cuándo actualizar**: al modificar código que ya tiene documentación en `docs/`.
- **Qué NO documentar**: bugfixes, cambios triviales, implementación evidente desde el
  código. Documentar de más también degrada el sistema.
- **Dónde**: los módulos con ruta espejan `src/app/` (`src/app/patients/` →
  `docs/patients/`). Lo transversal va en `docs/database/` o `docs/platform/`.
- **Qué incluir**: el qué, el porqué y el cómo a nivel conceptual. No repetir lo que el
  código ya dice — la sección *Decisiones de diseño* es la más valiosa.
- **Cómo**: plantillas y convenciones en [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).
- **Sincronía**: si tocas código documentado, actualiza el doc **en el mismo commit**.
- **Paths**: verifica cada path con `ls` antes de commitear. Nunca los escribas de
  memoria — un path roto induce a inventar.
- **Términos nuevos del dominio**: añádelos a [`docs/glossary.md`](docs/glossary.md).

**Navegación:**

| Si buscas… | Ve a |
|---|---|
| Visión general y orden de lectura | [`docs/architecture.md`](docs/architecture.md) |
| Significado de un término | [`docs/glossary.md`](docs/glossary.md) |
| Esquema, RLS o migraciones | [`docs/database/`](docs/database/README.md) |
| Índice completo | [`docs/README.md`](docs/README.md) |

## Convención de idioma (regla principal del proyecto)

**Todo el código en inglés. Comentarios y documentación en español.**

| Elemento | Idioma | Ejemplo |
|---|---|---|
| Nombres de carpetas y archivos | Inglés | `src/app/patients/[id]/history/` |
| Rutas / URLs | Inglés | `/calculators/fluid-therapy` |
| Variables, funciones, tipos, props | Inglés | `weight`, `calculate()`, `PatientForm` |
| Claves de i18n | Inglés | `t.pages.bodySurfaceArea` |
| Comentarios en el código | **Español** | `{/* Búsqueda + filtro */}` |
| Documentación (este archivo, etc.) | **Español** | — |
| Textos visibles de UI | Vía i18n (es/en) | `t.pages.patients.title` |

**Excepciones deliberadas** (no las "corrijas"):

- **Valores de datos en español**: `Species = "perro" | "gato" | "otro"` y `Sex = "macho" | "hembra"`. Son datos ya almacenados en Supabase; cambiarlos exige una migración de filas existentes, no un renombrado.
- **Contenido del PDF de recetas**: los textos dentro de `generatePDF` ("DATOS DEL PACIENTE", "Firma del Medico Veterinario") son contenido visible para el usuario final y van en español, sin acentos (ASCII) por compatibilidad con jsPDF.
- **Nombres impuestos por el framework**: `page.tsx`, `layout.tsx`, `route.ts`, `src/app/`, `src/proxy.ts`, `next.config.ts`, `supabase/migrations/`. No son renombrables.
- **Columnas de Supabase**: `weight_kg`, `owner_name`, `vet_license`, etc. Son el esquema real de la base de datos.

## Proyecto

**PawCure** — plataforma veterinaria (Next.js 16 App Router + React 19 + Supabase + Tailwind v4). Módulos: calculadoras clínicas, gestión de pacientes, historial clínico y generador de recetas en PDF.

## Comandos

```bash
npm run dev      # servidor de desarrollo (localhost:3000)
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # eslint (flat config, stock eslint-config-next)
npx tsc --noEmit # typecheck — no hay script definido para esto
```

No hay tests ni framework de testing. La verificación real de un cambio es `npx tsc --noEmit` seguido de `npm run build`.

Existen **dos lockfiles** (`package-lock.json` y `pnpm-lock.yaml`). Usa npm salvo indicación contraria.

### Variables de entorno (requeridas, no documentadas en el README)

`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `.env.local` (plantilla en `.env.example`). Sin ellas la app falla en runtime: los tres clientes Supabase las leen con `!`.

La clave publicable (`sb_publishable_…`) es la que Supabase llamaba `anon key`. Nunca uses aquí la `secret`/`service_role`: omite RLS, que es la única barrera de datos de esta app.

### Migraciones

`supabase/migrations/00X_*.sql` se aplican en orden numérico (no hay `config.toml`). Al añadir tablas replica el patrón existente: `user_id` + RLS con `(select auth.uid()) = user_id` + índices + trigger `set_updated_at()`.

## Arquitectura

### Auth y routing — todo el gating está en un solo sitio

`src/proxy.ts` es el middleware (**convención `proxy` de Next 16**, reemplaza `middleware.ts`; el historial muestra un intento fallido en `420ce71` y su reinstauración en `215ba58`). Delega en `updateSession()` de `src/lib/supabase/middleware.ts`, que:

- refresca la sesión Supabase vía cookies (`@supabase/ssr`),
- sin usuario + ruta no-`/auth/*` → redirige a `/auth/login` (**la app entera está tras login, incluidas las calculadoras**),
- con usuario en `/auth/*` → redirige a `/`.

Las páginas **no** hacen guard de auth; asumen sesión y solo llaman `getUser()` para obtener el `user_id` en escrituras. Si mueves lógica de auth, es aquí.

`/auth/callback` está registrada en el dashboard de Supabase como redirect URL permitida. **Renombrar esa ruta rompe los correos de confirmación** hasta que se actualice el dashboard manualmente.

### Cliente-first: casi no hay servidor

Prácticamente cada página es `"use client"` y consulta Supabase desde `useEffect` con `createClient()` de `src/lib/supabase/client.ts`. Consecuencias:

- `src/lib/supabase/server.ts` se usa **solo** en `src/app/auth/callback/route.ts`. Es el único route handler.
- No hay server actions, ni API routes, ni react-query/SWR, ni capa de fetch compartida. `supabase.from(...)` va directo en el componente.
- Todas las páginas de `/patients` declaran `export const dynamic = "force-dynamic"` (el prerender estático rompía).
- `createClient()` se llama **dentro** de efectos/handlers, nunca en el cuerpo del módulo (ejecutarlo en SSR rompía).

### Modelo de datos

`auth.users` 1─1 `profiles` · `auth.users` 1─N `patients` · `patients` 1─N `clinical_records`.

Multi-tenancy por usuario: cada fila lleva `user_id` y **RLS es la única barrera** — las queries de listado no filtran por `user_id`, confían en la política. Los inserts sí lo setean explícitamente. No hay roles ni tabla de clínica.

- `profiles`: se autocrea con trigger `handle_new_user` al registrarse. `vet_name`/`vet_license` (migración 004) alimentan las recetas.
- `species`/`sex` son `text` sin enum en la DB; las uniones viven solo en TypeScript.
- Tipos escritos a mano en `src/types/` (no hay `supabase gen types`), y los clientes no llevan genérico `Database`: **los resultados de queries no están type-checked**. `profiles` no tiene tipo.
- `src/types/*.ts` contiene además defaults de formulario (`emptyPatientForm`) y helpers de dominio (`calcAge`, `formatAge`, `formatDate`).

### Providers y shell

`layout.tsx` → `LanguageProvider` → `AuthProvider` → `AppShell`. `AppShell` oculta el shell en `/auth/*`; si no, renderiza `Sidebar` + `<main>` cuyo padding alterna entre sidebar completo y rail según `FULL_SIDEBAR_ROUTES`.

### Flujo de recetas (`src/app/prescriptions/page.tsx`, ~600 líneas)

Es el archivo más denso y el que más se enreda con otros módulos:

1. Prefill del perfil: localStorage (`pawcure-vet-name`/`pawcure-vet-license`) primero, luego `profiles` de Supabase como fuente autoritativa.
2. Carga **toda** la tabla `patients` en memoria para el autocomplete; el formulario sigue editable sin paciente seleccionado (pacientes de mostrador).
3. `generatePDF`: construye el PDF imperativamente con `new jsPDF()` y lo descarga con `doc.save()`. Nada se sube al servidor.
4. Si hay paciente seleccionado, inserta una fila en `clinical_records` (`instructions` → columna `notes`) y muestra banner según `syncStatus`.

## Convenciones de código

- **i18n**: `en.ts` debe reflejar estructuralmente a `es.ts` (el tipo es `typeof es`). Incluye funciones (`patientsCount(n)`), no solo strings. Patrón de uso: `const p = t.pages.patients`.
- **Estilos**: Tailwind v4 CSS-first, **sin `tailwind.config`**. Los tokens semánticos (`surface`, `border`, `muted`, `primary`, `danger`…) se definen en `globals.css` con `@theme inline` + paleta `.dark`. Dark mode = clase manual en `<html>`, con script inline en `<head>` como guarda anti-FOUC y clave `pawcure-theme`. Vocabulario recurrente: `rounded-xl/2xl`, `border-border bg-surface`, `bg-primary/10`, `text-muted`. Los banners semánticos usan colores Tailwind crudos con variantes `dark:` en vez de tokens.
- **Formularios**: estado en un objeto único + setter genérico `set(field, value)`; numéricos como string convertidos en submit (`parseFloat(x) || null`). `PatientForm`/`ClinicalRecordForm` reciben `onSubmit`; la página dueña hace el insert/update.
- **Errores**: el `{ error }` de Supabase se mapea a strings traducidos (`p.errorLoad`, `p.errorSave`); `catch {}` vacío alrededor de localStorage.
- **Iconos**: lucide-react, típicamente `h-4 w-4` con `strokeWidth` explícito.
- Claves de localStorage con prefijo `pawcure-`.
- `cn()` de `src/lib/utils.ts` existe pero solo lo usa `ui/Skeleton.tsx`; el resto usa template literals.

## Trampas conocidas

- **Componentes muertos**: `ThemeToggle.tsx`, `SearchBar.tsx` y `CalculatorCard.tsx` no se importan en ningún sitio. `ThemeToggle` duplica la lógica de tema que realmente vive en el hook privado `useTheme` dentro de `ProfilePanel.tsx`. Editar el equivocado no hace nada.
- **Acoplamiento por DOM**: `/prescriptions` abre el panel de perfil con `document.querySelector("[data-profile-trigger]").click()`. Renombrar ese atributo en `ProfilePanel` rompe el enlace.
- **Lógica duplicada que hay que mantener sincronizada**: `FULL_SIDEBAR_ROUTES` (en `AppShell.tsx` y `Sidebar.tsx`), la carga/guardado del perfil veterinario (en `ProfilePanel` y en `prescriptions/page.tsx`), `SPECIES_EMOJI` (2–3 archivos) y dos `formatDate` distintos (`types/clinicalRecord.ts` dd/mm/yyyy vs. el formato largo español de recetas).
- **Añadir una calculadora toca 4+ archivos**: `lib/calculators.ts` (registro), ambos archivos i18n (`t.categories` y `t.calculatorMeta` se indexan por el id), `CalcIcon.tsx` si el icono es nuevo, y la página nueva. El `id` del registro **es** el segmento de ruta y la clave de i18n a la vez.
- El PDF es **solo español y solo tema claro**: strings y colores hardcodeados en `generatePDF`, ignoran `useLanguage` y el dark mode.
- `/prescriptions` carga la tabla `patients` completa en memoria — escala mal.
- `calcAge` aproxima con 365/30 días; las edades mostradas pueden desviarse.
- `signOut` hace redirect de página completa (`window.location.href`), no navegación de router.
- **Los borrados de pacientes y de expedientes clínicos son definitivos**: `.delete()` directo, sin soft delete ni tabla de auditoría. Para un sistema de expedientes clínicos esto es un riesgo real; considéralo antes de añadir más superficie de borrado.
- Lint arrastra 8 avisos preexistentes (`react-hooks/set-state-in-effect`) en `LanguageContext`, `ThemeToggle`, `SearchBar` y `ProfilePanel`.
- El README es el boilerplate intacto de create-next-app; no lo trates como fuente de verdad.
