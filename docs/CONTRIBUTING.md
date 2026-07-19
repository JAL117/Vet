# Guía de contribución a `docs/`

Esta guía define **cómo** documentar en este repositorio: plantillas, estructura y
convenciones.

Para las reglas de **cuándo y qué** documentar, ver la sección `## Documentación` de
[`CLAUDE.md`](../CLAUDE.md). Son fuentes complementarias:

- **CLAUDE.md** → reglas (cuándo, qué, dónde)
- **CONTRIBUTING.md** (este archivo) → plantillas y convenciones (cómo)

---

## Estructura: espejo de `src/app/`

La documentación de cada módulo de ruta vive en la carpeta homónima:

| Código | Documentación |
|---|---|
| `src/app/patients/` | `docs/patients/` |
| `src/app/calculators/` | `docs/calculators/` |
| `src/app/prescriptions/` | `docs/prescriptions/` |

**Regla:** el mapeo `src/app/<módulo>` → `docs/<módulo>/README.md` debe funcionar
siempre. Toda ruta documentada tiene carpeta y README, aunque sea corto. No conviertas
un módulo en archivo suelto "porque solo tiene un doc": eso rompe la propiedad que
hace útil esta estructura.

Lo que **no es una ruta** vive aparte:

| Tema | Ubicación |
|---|---|
| Esquema, RLS, migraciones | `docs/database/` |
| i18n, convenciones de UI | `docs/platform/` |

---

## Plantillas

### README de módulo (orquestador)

```markdown
# <Nombre del módulo>

<1-2 líneas: qué hace este módulo en el producto>

## Arquitectura

<Diagrama ASCII de las piezas principales y cómo se conectan>

## Rutas

| Ruta | Archivo | Qué hace |
|------|---------|----------|

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|

## Decisiones de diseño

<Por qué se hizo así — lo que NO se deduce leyendo el código>

## Ver también

<Links a docs de otros módulos relacionados>
```

### Feature doc

```markdown
# <Nombre del feature>

## Resumen

<1-3 líneas: qué hace, por qué existe, cuándo se usa>

## Flujo

<Diagrama ASCII, lista o pseudocódigo del flujo principal>

## Modelo de datos

<Tablas y tipos TypeScript relevantes>

## Archivos clave

| Archivo | Responsabilidad |

## Decisiones de diseño

## Ver también
```

**Todas las secciones son opcionales salvo `Resumen`.** Un feature simple puede no
tener modelo de datos.

**Por qué `Resumen` es obligatorio:** los agentes de IA leen **un** archivo, no el
árbol completo. Cada doc debe orientar a quien llega directo, sin haber leído el hub.

---

## Convenciones

### Idioma

Sigue la convención del proyecto: **contenido en español; rutas, identificadores,
nombres de archivo y columnas de base de datos en inglés.**

- Nombres de archivo en `kebab-case.md` (`adding-a-calculator.md`)
- `README.md` en mayúsculas (única excepción)

### Paths: verificados, nunca de memoria

**Antes de commitear cualquier tabla de "Archivos clave", ejecuta `ls <path>` sobre
cada entrada.**

Un path roto es peor que no poner path: engaña al lector humano y hace que un agente
de IA invente el contenido del archivo que no encuentra. Copia los paths desde `find`
o `ls`, no los escribas de memoria.

### Referencias cruzadas

Cuando un doc menciona funcionalidad de otro módulo, **no la expliques: enlaza**. Una
sola fuente de verdad.

Formato: paths relativos desde la ubicación del archivo.

```markdown
<!-- Dentro de docs/prescriptions/README.md -->
Al generar la receta con un paciente registrado se inserta una fila en el historial.
Ver [clinical-records](../patients/clinical-records.md).
```

**Regla de bidireccionalidad:** si A dice que escribe en B, el doc de B debe mencionar
que A escribe en él. Ambos lados deben existir.

Esta regla es **obligatoria**, no recomendable: la estructura en espejo separa flujos
que en el código están acoplados, y los enlaces cruzados son lo único que reconstruye
esa relación.

### Qué va en "Decisiones de diseño"

La sección más valiosa del sistema. El código dice **qué** hace; este apartado dice
**por qué**.

Documenta aquí:

- Decisiones deliberadas que parecen errores (`force-dynamic` en todas las páginas de
  pacientes, `user_id` denormalizado en `clinical_records`)
- Restricciones externas que el código no revela (`/auth/callback` está registrada en
  el dashboard de Supabase)
- Acoplamientos frágiles (el `querySelector` entre recetas y el panel de perfil)
- Compromisos conocidos (cargar la tabla `patients` entera en memoria)

Sin esta sección, un agente "corrige" decisiones intencionadas.

### Deudas conocidas

Cuando un módulo tenga limitaciones asumidas, añade una sección `## Deudas conocidas`.
Evita que se reporte como bug algo ya sabido, y avisa antes de construir encima de un
cimiento flojo.

---

## Regla anti-documentación-vacía

**No crees archivos con solo encabezados.** Un doc que promete y no cumple es peor que
su ausencia: el lector pierde el tiempo y el agente asume que el tema está cubierto.

Si un módulo aún no tiene documentación, simplemente no aparece en
[`README.md`](./README.md). El hub refleja únicamente lo que existe.

---

## Mantenimiento

> **Toda tarea empieza leyendo el doc del módulo y termina actualizándolo.** El flujo
> completo, con su checklist, está en la sección `## Documentación` de
> [`CLAUDE.md`](../CLAUDE.md). Esta guía cubre el *cómo* escribirlo; aquel el *cuándo*.

- **Sincronía código ↔ doc:** si modificas código documentado, actualiza el doc **en
  el mismo commit**.
- **Términos de dominio:** si introduces un término nuevo, añádelo a
  [`glossary.md`](./glossary.md).
- **Paths:** ejecuta `ls` antes de commitear tablas de archivos clave.
- **Links bidireccionales:** al añadir una relación entre módulos, verifica que el otro
  lado también la refleje.

---

## Ver también

- [`README.md`](./README.md) — hub de navegación
- [`architecture.md`](./architecture.md) — visión general y orden de lectura
- [`glossary.md`](./glossary.md) — términos del dominio
- [`CLAUDE.md`](../CLAUDE.md) — reglas de cuándo y qué documentar
