# Guía Rápida (Referencia)

Módulo de consulta rápida de valores clínicos de referencia para perros y gatos: constantes vitales, hematología, bioquímica sanguínea y pesos promedio por raza, con búsqueda de texto libre sobre todas las tablas.

## Arquitectura

```
Navegador (client component, "use client")
│
└── /reference ──► page.tsx
        │
        ├── sectionsConfig (const del módulo)
        │     └── 5 secciones × filas hardcodeadas (string[][])
        │
        ├── useState(search) ──► filtra filas y secciones en memoria
        │
        └── useLanguage() ──► t.pages.reference (títulos y cabeceras traducidas)
```

Todo ocurre en el cliente: no hay fetch, ni Supabase, ni API. La búsqueda es un `filter` + `includes` case-insensitive sobre las celdas.

## Rutas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/reference` | [`../../src/app/reference/page.tsx`](../../src/app/reference/page.tsx) | Página única del módulo: buscador, navegación por anclas (`#signos-vitales`, `#hematologia`, `#bioquimica`, `#pesos-perros`, `#pesos-gatos`) y las 5 tablas. |

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| [`../../src/app/reference/page.tsx`](../../src/app/reference/page.tsx) | Contiene TODO el módulo: los datos (`sectionsConfig`), el componente de tabla (`ReferenceTable`) y la página (`ReferenciaPage`). |
| [`../../src/components/Disclaimer.tsx`](../../src/components/Disclaimer.tsx) | Banner de aviso legal reutilizado al pie de la página. |
| [`../../src/lib/i18n/es.ts`](../../src/lib/i18n/es.ts) | Claves `pages.reference.*`: título, placeholder de búsqueda, nombres de sección y cabeceras de tabla. |

## Decisiones de diseño

- **Los datos clínicos están hardcodeados en el propio componente** (`sectionsConfig`, arriba de `page.tsx`), no en base de datos ni en un JSON aparte. Consecuencia: editar un rango de referencia o añadir una raza requiere **modificar el código y desplegar**; no hay UI de administración ni forma de que un usuario los cambie. Es deliberado — son constantes de literatura veterinaria, no datos del usuario — pero si algún día se quieren editar en caliente habría que moverlos a Supabase o a un archivo de datos.
- **Las celdas son bilingües "a mano"**: cada fila lleva los dos idiomas concatenados (`"Glucosa / Glucose"`, `"Rosas, húmedas / Pink, moist"`), en lugar de pasar por el sistema de i18n. Solo los títulos de sección y las cabeceras de columna vienen de `t.pages.reference`. Ventaja colateral: la búsqueda encuentra el parámetro tanto en español como en inglés sin lógica extra.
- **La búsqueda filtra a dos niveles**: oculta filas que no coinciden y desmonta secciones enteras sin coincidencias (`ReferenceTable` devuelve `null`). La navegación por anclas se oculta mientras hay búsqueda activa porque las secciones pueden no existir.
- **Dos formas de tabla, un solo componente**: `headerType` distingue tablas parámetro/perro/gato (`paramDogCat`) de tablas raza/peso/tamaño (`breedWeightSize`); solo cambian las cabeceras, las filas siempre son `string[][]` de 3 columnas.
- La ruta es de las pocas con **sidebar completo** (está en `FULL_SIDEBAR_ROUTES`, ver [convenciones de UI](../platform/ui-conventions.md)).

## Ver también

- [`../platform/i18n.md`](../platform/i18n.md) — de dónde salen `t.pages.reference` y el patrón `const pr = t.pages.reference`.
- [`../platform/ui-conventions.md`](../platform/ui-conventions.md) — tokens (`bg-surface`, `text-muted`, `border-border`) que usan las tablas.
