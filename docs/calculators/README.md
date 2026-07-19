# Calculadoras

Módulo de calculadoras clínicas de PawCure: 10 herramientas de cálculo veterinario agrupadas en 4 categorías, definidas en un registro estático y renderizadas como páginas independientes bajo `/calculators`.

## Arquitectura

```
                    src/lib/calculators.ts  (registro estático)
                    - categories: 4 CategoryInfo
                    - calculators: 10 Calculator {id, category, path, icon, ...}
                    - getCalculatorsByCategory(), searchCalculators(), getCategoryInfo()
                              |
        +---------------------+----------------------+--------------------+
        v                     v                      v                    v
  /calculators          Sidebar.tsx            SearchBar.tsx         page.tsx (home)
  (índice por            (subárbol de           (filtro por           (solo el conteo
   categorías)            categorías con         calculatorMeta;       total: totalCalcs)
                          links a cada calc)     hoy sin montar)
        |
        v
  src/app/calculators/<id>/page.tsx   (10 páginas "use client", una por id)
        ^
        |  textos: useLanguage() -> t.calculatorMeta[id], t.pages.<camelCase(id)>
        |
  src/lib/i18n/es.ts  <--- typeof es ---  src/lib/i18n/en.ts
```

Los consumidores (índice, sidebar, home) iteran el registro; ninguno tiene una lista propia de calculadoras. Los textos visibles salen de i18n, no del registro (ver [Decisiones de diseño](#decisiones-de-diseño)).

## Rutas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/calculators` | [`../../src/app/calculators/page.tsx`](../../src/app/calculators/page.tsx) | Índice: agrupa las calculadoras por categoría con acentos de color por categoría |
| `/calculators/dose-by-weight` | [`../../src/app/calculators/dose-by-weight/page.tsx`](../../src/app/calculators/dose-by-weight/page.tsx) | Dosis por peso: volumen a administrar = (peso × dosis) / concentración |
| `/calculators/fluid-therapy` | [`../../src/app/calculators/fluid-therapy/page.tsx`](../../src/app/calculators/fluid-therapy/page.tsx) | Fluidoterapia: mantenimiento, déficit, total 24 h y velocidad de goteo |
| `/calculators/transfusion` | [`../../src/app/calculators/transfusion/page.tsx`](../../src/app/calculators/transfusion/page.tsx) | Volumen de sangre entera a transfundir según hematocritos |
| `/calculators/body-surface-area` | [`../../src/app/calculators/body-surface-area/page.tsx`](../../src/app/calculators/body-surface-area/page.tsx) | Superficie corporal (BSA) para dosificación quimioterápica |
| `/calculators/cri-infusions` | [`../../src/app/calculators/cri-infusions/page.tsx`](../../src/app/calculators/cri-infusions/page.tsx) | Tasas de infusión continua (CRI) para fármacos IV |
| `/calculators/nutrition` | [`../../src/app/calculators/nutrition/page.tsx`](../../src/app/calculators/nutrition/page.tsx) | Requerimientos energéticos RER/DER y ración diaria |
| `/calculators/glucose` | [`../../src/app/calculators/glucose/page.tsx`](../../src/app/calculators/glucose/page.tsx) | Conversión de glucosa mg/dL ↔ mmol/L con rangos de referencia |
| `/calculators/age-equivalent` | [`../../src/app/calculators/age-equivalent/page.tsx`](../../src/app/calculators/age-equivalent/page.tsx) | Edad humana equivalente según especie y tamaño |
| `/calculators/body-condition` | [`../../src/app/calculators/body-condition/page.tsx`](../../src/app/calculators/body-condition/page.tsx) | Score de condición corporal en escala estandarizada |
| `/calculators/gestation` | [`../../src/app/calculators/gestation/page.tsx`](../../src/app/calculators/gestation/page.tsx) | Fechas estimadas de parto según especie y fecha de monta |

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| [`../../src/lib/calculators.ts`](../../src/lib/calculators.ts) | Registro estático: 4 categorías (`Emergency`, `Pharmacology`, `Nutrition`, `General`) y 10 calculadoras. Fuente de verdad de `id`, `category`, `path` e `icon` |
| [`../../src/app/calculators/page.tsx`](../../src/app/calculators/page.tsx) | Índice del módulo; mapea `categories` → secciones y resuelve nombres vía `t.calculatorMeta[calc.id]` |
| [`../../src/app/calculators/<id>/page.tsx`](../../src/app/calculators) | Una página por calculadora (client component); toda la lógica de cálculo vive aquí |
| [`../../src/components/Sidebar.tsx`](../../src/components/Sidebar.tsx) | Navegación: dentro de `/calculators` expande el árbol categorías → calculadoras leyendo el registro |
| [`../../src/components/SearchBar.tsx`](../../src/components/SearchBar.tsx) | Búsqueda sobre el registro filtrando por los textos de `t.calculatorMeta`. **Actualmente no está montado en ninguna página** (igual que `searchCalculators()` del registro, hoy sin consumidores) |
| [`../../src/components/CalcIcon.tsx`](../../src/components/CalcIcon.tsx) | Mapa string (kebab-case) → componente de lucide-react; fallback a `AlertCircle` si el nombre no existe |
| [`../../src/lib/i18n/es.ts`](../../src/lib/i18n/es.ts) | Textos en español: bloques `categories`, `calculatorMeta` (nombre/descripción por `id`) y `pages.<clave>` (textos internos de cada página). Define `export type Translations = typeof es` |
| [`../../src/lib/i18n/en.ts`](../../src/lib/i18n/en.ts) | Traducción inglesa, tipada como `Translations` — debe reflejar la estructura de `es.ts` exactamente |

## Decisiones de diseño

- **Registro estático, no filesystem routing "descubierto".** El índice, el sidebar y el home iteran `calculators[]`; añadir una entrada al registro hace aparecer la calculadora en toda la navegación sin tocar esos consumidores. La contraparte: el `path` debe coincidir a mano con el directorio real en `src/app/calculators/`.
- **Puras y sin persistencia.** Ninguna página de calculadora importa Supabase ni guarda estado (ni `localStorage`): todo el cálculo ocurre en el navegador con estado local de React. Por eso funcionan sin sesión y el pie del índice enlaza el aviso "cálculos locales en tu navegador". Si una calculadora futura necesita persistir, es una decisión de arquitectura, no un cambio menor.
- **Textos en i18n, no en el registro.** `calculators.ts` trae `name`/`description` en español, pero solo son *fallback*: la UI resuelve `t.calculatorMeta[calc.id]` primero (`meta?.name ?? calc.name`). El `id` es a la vez segmento de ruta y clave de i18n.
- **Iconos por nombre (string), no por componente.** `CalcIcon` desacopla el registro de lucide-react: el registro es datos serializables y el tree-shaking de iconos queda centralizado en un solo archivo. El costo: un icono nuevo exige registrarlo en el mapa o cae silenciosamente al fallback `AlertCircle`.
- **Patrón común de página.** Todas siguen la misma estructura: estado local con `useState` (inputs como string), `validate()` que acumula errores en un `Record<string, string>`, `calculate()` que solo corre si la validación pasa, y `clear()` que resetea inputs, resultado y errores. Resultado en un panel condicional con la fórmula desglosada.

## Ver también

- [Añadir una calculadora nueva](./adding-a-calculator.md) — guía paso a paso de los archivos a tocar.
- [`../platform/i18n.md`](../platform/i18n.md) — el sistema de traducciones y por qué `Translations = typeof es` obliga a mantener `en.ts` sincronizado.
- [`../../src/contexts/LanguageContext.tsx`](../../src/contexts/LanguageContext.tsx) — hook `useLanguage()` que entrega `t` a todas las páginas.
- Página de aviso legal enlazada desde el índice: `/disclaimer`.
