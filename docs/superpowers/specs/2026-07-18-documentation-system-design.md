# Diseño: sistema de documentación de PawCure

**Fecha:** 2026-07-18
**Estado:** Aprobado
**Referencia:** sistema de documentación de 1to1 (`main-server`)

## Contexto

PawCure tenía un solo archivo de documentación (`CLAUDE.md`) más un doc de base de
datos copiado de otro proyecto. El objetivo es un "cerebro" de documentación que
sirva a la vez a personas y a agentes de IA.

Se tomó como referencia el sistema de 1to1, cuyo acierto central es **separar tres
responsabilidades** que suelen mezclarse:

| Capa | Archivo | Responde |
|---|---|---|
| Reglas | `CLAUDE.md §Documentación` | *cuándo* y *qué* documentar |
| Plantillas | `docs/CONTRIBUTING.md` | *cómo* escribirlo |
| Navegación | `docs/README.md` | *dónde* está cada cosa |

## Restricción de escala

1to1 tiene ~45.000 líneas de documentación repartidas en ~180 archivos, con 12+
módulos y ~200 migraciones. PawCure tiene ~7.700 líneas de código, 4 migraciones y
3 tablas.

**Copiar la estructura completa produciría un sistema de documentación más pesado
que el código documentado**, con carpetas vacías que un agente leería como señal de
información faltante. La decisión fue montar solo lo que el proyecto justifica hoy,
pero con las plantillas y reglas del sistema completo ya definidas, de modo que
crecer signifique **añadir archivos, no reestructurar**.

## Decisiones

### 1. Alcance: proporcional hoy, preparado para crecer

Se descartó replicar el andamiaje completo de 1to1 (carpetas de todos los módulos,
sistema de banners de migración, `docs/plans/`) por prematuro.

### 2. Solo documentación en esta fase

El "cerebro de IA" de 1to1 incluye un `.claude/` versionado con 11 subagentes
revisores, skills y comandos. Se pospone a una fase 2: primero deben existir
convenciones escritas que esos agentes puedan hacer cumplir.

### 3. Estructura: espejo de `src/app/`

Se evaluaron tres descomposiciones:

- **A — Por dominio clínico:** agrupar pacientes, historial y recetas en `clinical/`,
  respetando su acoplamiento real.
- **B — Espejo de `src/app/`** *(elegida)*: una carpeta de docs por módulo de ruta.
- **C — Plana:** todos los `.md` en `docs/` sin subcarpetas.

**Se eligió B por el mapeo determinista:** un agente que trabaja en `src/app/patients/`
sabe sin buscar que la documentación está en `docs/patients/`. Esa predictibilidad
pesa más que la agrupación por dominio.

**Consecuencias asumidas:**

- Un espejo puro no cubre lo transversal (base de datos, i18n, convenciones de UI),
  que no son rutas. Van en `database/` y `platform/`.
- Se prioriza la predictibilidad sobre el minimalismo de tiers: **toda ruta
  documentada tiene carpeta y README**, aunque sea corto. Quitarle la carpeta a los
  módulos de un solo doc rompería justo la propiedad por la que se eligió B.
- La estructura fragmenta flujos acoplados: recetas escribe en `clinical_records`, así
  que dos módulos describen un mismo flujo desde lados distintos. **La regla de
  bidireccionalidad pasa de recomendable a obligatoria.**

### 4. Estructura final

```
docs/
├── README.md                    hub de navegación
├── architecture.md              mapa del sistema + orden de lectura
├── glossary.md                  términos veterinarios y de producto
├── CONTRIBUTING.md              plantillas y convenciones
│
│   ── Espejo de src/app/ ──
├── auth/README.md
├── calculators/
│   ├── README.md
│   └── adding-a-calculator.md
├── patients/
│   ├── README.md
│   └── clinical-records.md
├── prescriptions/README.md
├── reference/README.md
│
│   ── Transversal ──
├── database/
│   ├── README.md  schema.md  rls.md  migrations.md
└── platform/
    ├── README.md  i18n.md  ui-conventions.md
```

`disclaimer` y `documents` no reciben documentación: uno es texto legal estático y el
otro un redirect de tres líneas.

### 5. Plantillas

Dos, adaptadas de 1to1:

- **README de módulo:** título, 1-2 líneas, `Arquitectura`, `Rutas`, `Archivos clave`,
  `Decisiones de diseño`, `Ver también`.
- **Feature doc:** `Resumen` (única obligatoria), `Flujo`, `Modelo de datos`,
  `Archivos clave`, `Decisiones de diseño`, `Ver también`.

Se eliminó la sección `Dependencias` ("Consume / Consumido por") de la plantilla de
1to1: con 7 módulos, `Ver también` ya cubre el grafo, y mantener dos listas de
relaciones se desincroniza sola.

### 6. Mecanismos orientados a agentes de IA

Lo que distingue un cerebro de una carpeta con markdown:

| Mecanismo | Función |
|---|---|
| Tabla `Archivos clave` con paths verificados | El agente salta al código sin explorar a ciegas |
| `ls` obligatorio antes de commitear un path | Un path roto es peor que ninguno: induce a inventar |
| Glosario con columna "NO confundir con" | Desambigua activamente términos del dominio |
| `Decisiones de diseño` en cada doc | El código dice el *qué*; solo el doc dice el *porqué*. Sin esto, un agente "corrige" decisiones deliberadas |
| Cada doc autosuficiente (`Resumen` obligatorio) | Los agentes leen **un** archivo, no el árbol |
| `Deudas conocidas` | Evita que se reporte como bug algo ya sabido |

### 7. Regla anti-documentación-vacía

No se crean archivos con solo encabezados. **Un doc que promete y no cumple es peor
que su ausencia**, tanto para personas como para agentes. Cada archivo se escribe con
contenido real verificado contra el código, y el hub refleja únicamente lo que existe.

## Migración desde el estado previo

1. `src/Documents/DataBase/Database.md` → se reparte en `docs/database/`
   (`README.md`, `schema.md`, `rls.md`, `migrations.md`).
2. `src/Documents/` desaparece: la documentación no vive dentro de `src/`.
3. `CLAUDE.md` conserva arquitectura, comandos y trampas, y delega el detalle a
   `docs/` para no duplicar. Se le añade la sección `## Documentación` con las reglas.

## Fuera de alcance

- Tooling `.claude/` (subagentes, skills, comandos) — fase 2.
- `docs/plans/` y el sistema de banners de migración — prematuro.
- Documentación de API pública — PawCure no expone API.
