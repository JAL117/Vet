# Añadir una calculadora nueva

## Resumen

Guía paso a paso para incorporar una calculadora clínica al módulo. Existe porque el
`id` que eliges actúa simultáneamente como segmento de ruta, clave de i18n y entrada
del registro: si los tres no coinciden, la calculadora aparece rota o no compila.

Añadir una calculadora toca **4 archivos** (5 si el icono de lucide es nuevo). No hace falta tocar el índice, el sidebar ni el home: los tres iteran el registro y recogen la entrada nueva automáticamente.

Convención central: el `id` en kebab-case (p. ej. `dose-by-weight`) **es** a la vez:

- el segmento de ruta → `src/app/calculators/<id>/page.tsx`
- la clave de `calculatorMeta` en i18n → `t.calculatorMeta["dose-by-weight"]`
- y, en camelCase, la clave del bloque de página → `t.pages.doseByWeight`

Ejemplo guía en todos los pasos: una calculadora ficticia `shock-index` (categoría `Emergency`).

## 1. Registro — `src/lib/calculators.ts`

Añade una entrada al array `calculators`:

```ts
{
  id: "shock-index",
  name: "Indice de Shock",              // fallback; la UI prefiere i18n
  description: "Calcula el indice de shock (FC / PAS)",
  category: "Emergency",                // una de las 4 CalculatorCategory existentes
  path: "/calculators/shock-index",     // debe coincidir con id
  icon: "heart-pulse",                  // nombre kebab-case, ver paso 3
},
```

`name` y `description` son solo *fallback*: los consumidores hacen `meta?.name ?? calc.name`, así que lo que se ve en la UI sale de i18n (paso 2).

Si necesitas una **categoría nueva** (raro), además hay que tocar: el union `CalculatorCategory` y el array `categories` en este archivo, el bloque `categories` de `es.ts`/`en.ts` (clave `X` y `XDesc`), y el mapa `categoryAccents` en `src/app/calculators/page.tsx` (colores por categoría; si no, cae al acento de `General`).

## 2. Textos — `src/lib/i18n/es.ts` y `src/lib/i18n/en.ts`

En `es.ts`, dos bloques:

**a) `calculatorMeta`** — la clave es el `id` literal. Es lo que muestran el índice, el sidebar y la búsqueda:

```ts
calculatorMeta: {
  // ...
  "shock-index": { name: "Índice de Shock", description: "Calcula el índice de shock (FC / PAS)" },
},
```

**b) `pages.<camelCase(id)>`** — los textos internos de la página (título, subtítulo, labels, mensajes de error):

```ts
pages: {
  // ...
  shockIndex: {
    title: "Índice de Shock",
    subtitle: "...",
    // labels y errores que use tu página
  },
},
```

**Después replica ambas cosas en `en.ts` con la misma estructura exacta.** Esto no es opcional: `es.ts` termina con `export type Translations = typeof es`, y `en.ts` declara `export const en: Translations = { ... }`. El español define el *tipo*; si en inglés falta una clave, sobra una, o cambia de forma, el typecheck (`tsc`) falla. Es la red de seguridad que garantiza que ninguna traducción quede a medias — no la esquives con `as` ni `any`.

## 3. Icono — `src/components/CalcIcon.tsx` (solo si es nuevo)

El campo `icon` del registro es un string kebab-case que se resuelve en el mapa `iconMap` de `CalcIcon.tsx`. Si el icono ya está en el mapa (p. ej. `heart-pulse`, `droplets`, `gauge`), no toques nada. Si es un icono de lucide que no está:

```ts
import { Activity, /* ... */ } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  activity: Activity,
  // ...
};
```

Ojo: un nombre que no exista en el mapa **no falla** — cae silenciosamente al fallback `AlertCircle`. Si ves un triángulo de alerta donde esperabas tu icono, es esto.

## 4. La página — `src/app/calculators/<id>/page.tsx`

Crea el directorio con el `id` exacto y dentro un `page.tsx`. Sigue el patrón de las páginas existentes (`dose-by-weight` es la más simple como plantilla):

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ShockIndexPage() {
  const { t } = useLanguage();
  const p = t.pages.shockIndex;   // el bloque creado en el paso 2b

  // 1. estado local: inputs como string, resultado nullable, errores por campo
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. validate(): acumula mensajes en `errors`, devuelve boolean
  // 3. calculate(): if (!validate()) return; setResult(...)
  // 4. clear(): resetea inputs, resultado y errores

  // JSX: link "volver", card con título/subtítulo, inputs con error inline,
  // botones t.common.calculate / t.common.clear, panel de resultado condicional
}
```

Reglas del módulo:

- **Sin persistencia**: nada de Supabase, `localStorage` ni llamadas de red. El cálculo es puro y local (ver [README](./README.md#decisiones-de-diseño)).
- Reutiliza `t.common` para lo genérico (peso, botones, errores de peso) y deja en `p` solo lo específico de tu calculadora.

## Checklist final

- [ ] Entrada en `calculators[]` con `path` = `/calculators/<id>`
- [ ] `es.ts`: `calculatorMeta["<id>"]` + `pages.<camelCaseId>`
- [ ] `en.ts`: misma estructura, traducida (si no, no compila)
- [ ] Icono presente en `iconMap` de `CalcIcon.tsx`
- [ ] `src/app/calculators/<id>/page.tsx` creado
- [ ] `npx tsc --noEmit` pasa y la calculadora aparece en `/calculators`, en el sidebar y en el home

## Ver también

- [`README.md`](./README.md) — arquitectura del módulo y el registro de calculadoras
- [`../platform/i18n.md`](../platform/i18n.md) — por qué `en.ts` debe reflejar a `es.ts`
