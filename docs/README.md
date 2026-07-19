# Documentación de PawCure

Documentación técnica del proyecto. Si es tu primer contacto, empieza por
[`architecture.md`](./architecture.md).

## Navegación rápida

| Documento | Qué hay |
|---|---|
| [`architecture.md`](./architecture.md) | Visión general del sistema + orden de lectura sugerido |
| [`glossary.md`](./glossary.md) | Términos del dominio (paciente ≠ propietario ≠ usuario) |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Plantillas y convenciones para escribir documentación |

## Módulos

Los módulos con ruta espejan la estructura de `src/app/`: `src/app/patients/` se
documenta en `docs/patients/`.

| Módulo | Qué cubre | Documentación |
|---|---|---|
| Autenticación | Gating en `proxy.ts`, sesión, callback OAuth | [`auth/`](./auth/README.md) |
| Calculadoras | Registro, patrón común, cómo añadir una | [`calculators/`](./calculators/README.md) |
| Pacientes | Ficha del animal, propietario, historial clínico | [`patients/`](./patients/README.md) |
| Recetas | Formulario, generación de PDF, sync al historial | [`prescriptions/`](./prescriptions/README.md) |
| Referencia | Tablas de valores clínicos | [`reference/`](./reference/README.md) |

### Transversales

| Tema | Qué cubre | Documentación |
|---|---|---|
| Base de datos | Esquema, RLS, migraciones, tipos | [`database/`](./database/README.md) |
| Plataforma | i18n, tokens de tema, shell y convenciones de UI | [`platform/`](./platform/README.md) |

## Preguntas frecuentes

| Si buscas… | Ve a |
|---|---|
| Entender el sistema por primera vez | [`architecture.md`](./architecture.md) |
| El significado de un término del dominio | [`glossary.md`](./glossary.md) |
| Por qué las queries no filtran por `user_id` | [`database/rls.md`](./database/rls.md) |
| Cómo añadir una calculadora | [`calculators/adding-a-calculator.md`](./calculators/adding-a-calculator.md) |
| Cómo aplicar las migraciones a un proyecto nuevo | [`database/migrations.md`](./database/migrations.md) |
| Las variables de entorno necesarias | [`.env.example`](../.env.example) |
| Reglas de cuándo documentar | [`CLAUDE.md`](../CLAUDE.md) |
| Cómo escribir un doc nuevo | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |

## Decisiones de diseño del propio sistema

El registro de por qué la documentación tiene esta forma está en
[`superpowers/specs/2026-07-18-documentation-system-design.md`](./superpowers/specs/2026-07-18-documentation-system-design.md).

Dos reglas que conviene conocer antes de contribuir:

1. **Los paths se verifican con `ls` antes de commitear.** Un path roto es peor que no
   ponerlo: engaña al lector y hace que un agente de IA invente.
2. **No se crean archivos con solo encabezados.** Este índice refleja únicamente
   documentación que existe y tiene contenido real.
