# Convenciones de UI y estilado

## Resumen

Tailwind CSS **v4 en modo CSS-first**: **no existe `tailwind.config.*`** en el repo. Toda la configuración de tema vive en [`../../src/app/globals.css`](../../src/app/globals.css) — un bloque `@theme inline` mapea variables CSS a utilidades de Tailwind, y dos paletas (`:root` y `.dark`) definen los valores. El dark mode es por clase manual en `<html>`, y el layout global lo montan `AppShell` + `Sidebar`.

## Flujo

```
globals.css
├── @import "tailwindcss"
├── @custom-variant dark (&:where(.dark, .dark *))   ← variante dark: por clase
├── @theme inline { --color-primary: var(--primary); … }  ← genera bg-primary, text-muted, border-border…
├── :root  { --primary: #0d9488; … }                 ← paleta claro
└── .dark  { --primary: #2dd4bf; … }                 ← paleta oscuro

layout.tsx <head> ── script inline anti-FOUC ──► añade .dark a <html> antes del primer paint
ProfilePanel ── toggle ──► classList + localStorage "pawcure-theme"

layout.tsx <body> ──► <AppShell> ──► <Sidebar/> + <main> (padding según sidebar)
```

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| [`../../src/app/globals.css`](../../src/app/globals.css) | Tokens, paletas claro/oscuro, estilos base de `body`, inputs/selects globales, scrollbar, focus ring, animación `page-enter`. |
| [`../../src/app/layout.tsx`](../../src/app/layout.tsx) | Root layout: script anti-FOUC, fuentes Geist, providers y `AppShell`. |
| [`../../src/components/AppShell.tsx`](../../src/components/AppShell.tsx) | Decide el padding del `<main>` (`lg:pl-72` vs `lg:pl-16`) y omite el shell en rutas `/auth/*`. |
| [`../../src/components/Sidebar.tsx`](../../src/components/Sidebar.tsx) | Header + bottom-nav móvil, y sidebar de escritorio: completo o riel de iconos. |
| [`../../src/components/ui/Skeleton.tsx`](../../src/components/ui/Skeleton.tsx) | Placeholder de carga; único consumidor de `cn()`. |
| [`../../src/lib/utils.ts`](../../src/lib/utils.ts) | `cn()`: join de clases con filtro de falsy (sin tailwind-merge). |

## Tokens semánticos

Del `@theme inline` real (clase Tailwind ← variable, valores claro / oscuro):

| Utilidad | Variable | Claro | Oscuro | Uso |
|---|---|---|---|---|
| `*-background` | `--background` | `#f8fafc` | `#0b1120` | Fondo de página |
| `*-foreground` | `--foreground` | `#0f172a` | `#f1f5f9` | Texto principal |
| `*-surface` | `--surface` | `#ffffff` | `#111827` | Cards, sidebar, inputs |
| `*-surface-hover` | `--surface-hover` | `#f1f5f9` | `#1e2b3c` | Hover de filas/enlaces |
| `*-border` | `--border-color` | `#e2e8f0` | `#1e2f4a` | Bordes (nota: la variable NO se llama `--border`) |
| `*-muted` | `--muted` | `#64748b` | `#94a3b8` | Texto secundario |
| `*-primary` (+ `-light`/`-dark`) | `--primary` | `#0d9488` (teal-600) | `#2dd4bf` (teal-400) | Marca, estados activos |
| `*-accent` | `--accent` | `#7c3aed` | `#a78bfa` | Acento violeta |
| `*-danger` | `--danger` | `#dc2626` | `#f87171` | Errores/zonas de peligro |
| `*-warning` | `--warning` | `#d97706` | `#fbbf24` | Avisos |
| `*-success` | `--success` | `#059669` | `#34d399` | Éxito |

Como cada token cambia de valor bajo `.dark`, **usar el token ya resuelve ambos temas**: `bg-surface` no necesita `dark:bg-*`.

## Decisiones de diseño

- **Sin `tailwind.config`.** En Tailwind v4 el tema se declara en CSS; añadir un color nuevo = añadir la variable en `:root`/`.dark` y su línea en `@theme inline`. No busques (ni crees) un archivo de config JS.
- **Dark mode por clase manual, no por media query.** `@custom-variant dark (&:where(.dark, .dark *))` redefine `dark:` para depender de la clase `.dark` en `<html>`. Un **script inline en el `<head>`** de `layout.tsx` lee `localStorage("pawcure-theme")` (con fallback a `prefers-color-scheme`) y añade la clase **antes del primer paint** — es la guarda anti-FOUC; si se elimina, la página parpadea en claro al cargar en modo oscuro. El toggle del usuario está en `ProfilePanel` (no en `ThemeToggle.tsx`, que está muerto — ver abajo).
- **`FULL_SIDEBAR_ROUTES` está duplicada** — literalmente la misma constante `["/", "/reference"]` en [`AppShell.tsx`](../../src/components/AppShell.tsx) (línea 6) y [`Sidebar.tsx`](../../src/components/Sidebar.tsx) (línea 16). Una controla el padding del `<main>`, la otra si se renderiza sidebar completo o riel de iconos. **Hay que mantenerlas sincronizadas a mano**: cambiar solo una descuadra el layout (p. ej. sidebar ancho con padding estrecho). La comparación es por `includes(pathname)` exacto: las subrutas (p. ej. `/patients/[id]`) siempre caen en riel.
- **Vocabulario recurrente de clases** (imitar, no reinventar): card = `rounded-2xl border border-border bg-surface`; interactivo = `rounded-xl … transition-colors hover:bg-surface-hover`; activo = `bg-primary/10 text-primary`; texto secundario = `text-muted`; inputs y selects ya vienen estilados globalmente desde `globals.css` (no necesitan clases de borde/padding).
- **Excepción a los tokens: los banners semánticos usan colores Tailwind crudos con variantes `dark:`** en vez de `danger`/`warning`/`success`. Ej. real de `Disclaimer.tsx`: `border-amber-400/40 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200` (y patrón análogo con `emerald-*` en `ProfilePanel`, `red-*` en zonas de peligro). Los tokens semánticos solo dan un tono por tema; los banners necesitan fondo suave + borde + texto oscuro coordinados, de ahí el escape. Al crear un banner nuevo, copia uno existente completo con sus `dark:`.
- **`cn()` existe pero casi nadie lo usa.** Está en [`utils.ts`](../../src/lib/utils.ts) y **su único consumidor es `ui/Skeleton.tsx`**; el resto del código compone clases condicionales con template literals (`` className={`… ${activo ? "…" : "…"}`} ``). Cualquiera de los dos estilos es aceptado; no hay `tailwind-merge`, así que `cn()` no resuelve conflictos de clases, solo concatena.
- **Componentes muertos** (verificado por grep: nadie los importa): **`ThemeToggle.tsx`**, **`SearchBar.tsx`** y **`CalculatorCard.tsx`** en `src/components/`. Sus responsabilidades viven hoy en `ProfilePanel` (tema/idioma) y en las páginas. **Editar el archivo equivocado no tiene ningún efecto en la app** — si vas a tocar el toggle de tema o la búsqueda, no es ahí.

## Ver también

- [i18n.md](./i18n.md) — los textos que renderiza este shell (`t.nav.*`) y el selector de idioma en `ProfilePanel`.
- [`../database/README.md`](../database/README.md) — la otra capa transversal (datos).
