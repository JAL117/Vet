# Autenticación

Login con email/contraseña vía Supabase Auth. Toda la app (pacientes, recetas, calculadoras, referencia) vive detrás del login; solo `/auth/*` es pública.

## Arquitectura

```
Navegador ── request a cualquier ruta
    │
    ▼
src/proxy.ts                      (convención `proxy` de Next 16; el matcher
    │                              excluye _next/static, _next/image e imágenes)
    │  updateSession(request)
    ▼
src/lib/supabase/middleware.ts
    │  createServerClient ──► supabase.auth.getUser()   (refresca la sesión
    │                                                    y reescribe cookies)
    ├── sin user  y ruta fuera de /auth ──► redirect a /auth/login
    ├── con user  y ruta dentro de /auth ─► redirect a /
    ▼
Página renderizada (asume sesión válida — no hay guards en páginas)
    │
    ├── AuthProvider (client) ── createBrowserClient → getUser()
    │                            + onAuthStateChange → expone useAuth()
    └── AppShell ── si pathname empieza con /auth renderiza sin Sidebar

Flujo de registro / confirmación por correo:
/auth/register ── signUp({ emailRedirectTo: <origin>/auth/callback })
    │
    ▼  (link en el correo de confirmación)
GET /auth/callback?code=... ── createClient() de server.ts
    │                          exchangeCodeForSession(code)
    ├── ok    ──► redirect a `next` (default "/")
    └── error ──► redirect a /auth/login?error=auth_callback_error
```

## Rutas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/auth/login` | `src/app/auth/login/page.tsx` | Formulario email/contraseña. `signInWithPassword` con el cliente de navegador; en éxito `router.push("/")` + `router.refresh()`. Traduce errores de credenciales vía `LanguageContext`. |
| `/auth/register` | `src/app/auth/register/page.tsx` | Alta con validación local (mínimo 8 caracteres, confirmación). `signUp` guarda `full_name` en metadata y fija `emailRedirectTo` a `/auth/callback`. Muestra pantalla de éxito, no auto-loguea. |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Route handler `GET`. Intercambia el `code` del correo de confirmación por sesión (`exchangeCodeForSession`) y redirige a `next` o a login con `?error=auth_callback_error`. |
| Todas las demás (`/`, `/patients`, `/prescriptions`, `/calculators`, …) | `src/proxy.ts` | Gateadas por el proxy: sin sesión → redirect a `/auth/login`. |

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| `src/proxy.ts` | Único punto de entrada del gating. Delega todo a `updateSession()`; define el `matcher` que excluye estáticos. |
| `src/lib/supabase/middleware.ts` | `updateSession()`: refresca la sesión con `getUser()`, sincroniza cookies request/response y aplica los dos redirects (a login / fuera de `/auth`). |
| `src/lib/supabase/client.ts` | `createBrowserClient` para componentes client. Es el cliente usado en casi toda la app. |
| `src/lib/supabase/server.ts` | `createServerClient` con cookies de `next/headers`. Usado en un solo sitio: el callback. |
| `src/contexts/AuthContext.tsx` | `AuthProvider` + `useAuth()`: expone `user`, `loading` y `signOut`. Se suscribe a `onAuthStateChange`. |
| `src/app/auth/login/page.tsx` | UI de login. |
| `src/app/auth/register/page.tsx` | UI de registro + pantalla de "revisa tu correo". |
| `src/app/auth/callback/route.ts` | Intercambio código→sesión del flujo de confirmación por correo. |
| `src/components/AppShell.tsx` | Layout condicional: en `/auth/*` no renderiza `Sidebar` ni el `<main>` con padding. Montado en `src/app/layout.tsx` dentro de `AuthProvider`. |

## Decisiones de diseño

- **Todo el gating vive en un solo sitio.** `src/proxy.ts` → `updateSession()` es el único guard de auth de la app. Las páginas NO comprueban sesión: asumen que si se renderizan, hay usuario. Esto aplica a toda la app, incluidas las calculadoras y la referencia — no hay zona pública fuera de `/auth/*`. Si agregas una página nueva, ya está protegida sin hacer nada.
- **`src/proxy.ts` es la convención `proxy` de Next 16**, que reemplaza al `middleware.ts` clásico. El historial de git registra un intento fallido de usar la convención antigua (commit `420ce71`) y su reinstauración como `proxy` (`215ba58`). No lo renombres a `middleware.ts`: rompe la app completa (nada gatea y las cookies de sesión dejan de refrescarse).
- **`/auth/callback` está registrada en el dashboard de Supabase** como redirect URL permitida. Renombrar o mover esa ruta rompe los correos de confirmación de registro (los links del correo apuntan ahí) hasta actualizar el dashboard manualmente. El código no puede avisarte de esto: la dependencia vive fuera del repo.
- **`server.ts` se usa en un solo sitio:** `src/app/auth/callback/route.ts`. Es el único contexto server que necesita escribir cookies de sesión (el intercambio código→sesión). Todo lo demás — login, registro, contexto de auth, datos de la app — usa el cliente de navegador de `client.ts`. No introduzcas `server.ts` en Server Components sin entender su `try/catch` de `setAll`: ahí las cookies no se pueden escribir y se confía en que el middleware lo haga.
- **El comentario `// IMPORTANTE: no agregar lógica entre createServerClient y getUser()`** en `middleware.ts` (línea 28) es una advertencia real de Supabase, no estilo. `getUser()` es lo que dispara el refresh del token; los callbacks de cookies escriben el token renovado tanto en `request.cookies` como en `supabaseResponse`. Si intercalas lógica (sobre todo returns tempranos o creación de otra response), la response que devuelves puede no llevar las cookies renovadas: el navegador se queda con un token vencido y los usuarios sufren logouts aleatorios difíciles de reproducir.
- **`signOut` hace redirect de página completa** (`window.location.href = "/auth/login"` en `AuthContext.tsx`), no `router.push`. Es deliberado: el hard reload descarta todo el estado de React y caches del router, y garantiza que la siguiente request pase por el proxy ya sin cookies de sesión. Con navegación de router quedaría estado client obsoleto de la sesión anterior.
- **La cadena `/auth` está hardcodeada en 9 sitios repartidos en 6 archivos** (sin contar imports): `middleware.ts` (×2), `AuthContext.tsx` (×1), `AppShell.tsx` (×1), `register/page.tsx` (×3, incluido el `emailRedirectTo`), `login/page.tsx` (×1) y `callback/route.ts` (×1). Cuatro de ellos están fuera de `src/app/auth/`. Renombrar el segmento `/auth` exige tocar los 6 archivos **y** el dashboard de Supabase; no hay constante compartida.

## Ver también

- [`../database/rls.md`](../database/rls.md) — RLS, la barrera que protege los datos una vez pasado el gating.
- [`../database/schema.md`](../database/schema.md) — la tabla `profiles` y el trigger que la crea al registrarse.
- [`../patients/README.md`](../patients/README.md) — módulo de pacientes.
- [`../prescriptions/README.md`](../prescriptions/README.md) — generador de recetas.
- [`../platform/README.md`](../platform/README.md) — i18n y convenciones de UI.
