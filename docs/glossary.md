# Glosario de términos del dominio

Términos con significado específico en PawCure, que pueden diferir del uso común. Si
introduces un término nuevo del dominio en el código, añádelo aquí.

La columna **NO confundir con** existe a propósito: desambigua activamente para quien
lee —persona o agente de IA— y evita interpretaciones plausibles pero erróneas.

## Producto

| Término | Significado en PawCure | NO confundir con |
|---|---|---|
| **Paciente** | El **animal** atendido. Fila de la tabla `patients`. Sus datos de contacto son los del propietario, embebidos en la misma fila. | La persona que acude a la clínica — esa es el *propietario* |
| **Propietario** | La persona dueña del animal. **No tiene tabla propia**: sus datos viven embebidos en `patients` (`owner_name`, `owner_phone`…), por lo que se duplican si tiene varios pacientes. | Usuario de la aplicación; arrendador |
| **Usuario** | El **veterinario** autenticado. Fila en `auth.users` + `profiles`. Es el tenant: todo dato lleva su `user_id` y RLS lo aísla. | El propietario del animal; el paciente |
| **Receta** | Prescripción médica veterinaria que se genera como PDF y se descarga en el navegador. Módulo `/prescriptions`. | Receta de cocina; una plantilla reutilizable |
| **Expediente / Registro clínico** | Una consulta registrada de un paciente. Fila de `clinical_records`. Incluye motivo, peso, temperatura, diagnóstico y tratamiento. | El historial completo (que es el conjunto de registros) |
| **Historial clínico** | El conjunto cronológico de registros clínicos de un paciente. Ruta `/patients/[id]/history`. | Un registro individual |
| **Módulo** | Área funcional de la plataforma con ruta propia (calculadoras, pacientes, recetas, referencia). | Módulo de JavaScript/ES |
| **Cédula profesional** | Número de licencia del veterinario (`profiles.vet_license`). Aparece impresa en el PDF de la receta. | Identificador de usuario; matrícula del animal |
| **Rail** | Estado colapsado del sidebar: solo iconos, sin etiquetas. Se activa fuera de las rutas de `FULL_SIDEBAR_ROUTES`. | Barra de navegación móvil (que es un componente distinto) |

## Clínico

Términos veterinarios que dan nombre a las calculadoras. El registro está en
[`src/lib/calculators.ts`](../src/lib/calculators.ts).

| Término | Significado | NO confundir con |
|---|---|---|
| **CRI** | *Constant Rate Infusion* — infusión continua de un fármaco a velocidad constante. Calculadora `/calculators/cri-infusions`. | Un bolo o dosis única |
| **RER / DER** | *Resting Energy Requirement* (requerimiento energético en reposo) y *Daily Energy Requirement* (diario, RER ajustado por factor). Calculadora `/calculators/nutrition`. | Calorías del alimento |
| **BSA** | *Body Surface Area* — superficie corporal en m², usada para dosificar quimioterapia (más precisa que el peso). Calculadora `/calculators/body-surface-area`. | Peso corporal |
| **Condición corporal** | Escala estandarizada de **9 puntos** que evalúa el estado nutricional. Calculadora `/calculators/body-condition`. | El peso en kg; el índice de masa corporal humano |
| **Fluidoterapia** | Cálculo de fluidos intravenosos: mantenimiento + déficit por deshidratación, con velocidad de goteo. Calculadora `/calculators/fluid-therapy`. | Transfusión sanguínea |
| **Volemia** | Volumen sanguíneo total estimado del animal. Factor que varía por especie y entra en el cálculo de transfusión. | Hematocrito |
| **Hematocrito** | Porcentaje del volumen sanguíneo ocupado por glóbulos rojos. Entran tres en el cálculo de transfusión: del receptor, deseado y del donante. | Hemoglobina |
| **Edad equivalente** | Estimación de la edad del animal en años humanos, según especie y tamaño. Calculadora `/calculators/age-equivalent`. | La edad real, que se calcula desde `birth_date` |

## Técnico

| Término | Significado en PawCure | NO confundir con |
|---|---|---|
| **RLS** | *Row Level Security* de PostgreSQL. En esta app es la **única** barrera de aislamiento entre veterinarios: las queries de listado no filtran por `user_id`. Ver [`database/rls.md`](./database/rls.md). | Validación en el cliente; middleware de auth |
| **Publishable key** | Clave pública de Supabase (`sb_publishable_…`), antes llamada *anon key*. Segura en el navegador porque RLS restringe el acceso. | La *secret key* (`sb_secret_…`, antes `service_role`), que **omite RLS** y nunca debe llegar al cliente |
| **Proxy** | El middleware de Next 16, en [`src/proxy.ts`](../src/proxy.ts). Convención que reemplaza a `middleware.ts`. Aquí vive **todo** el gating de autenticación. | Un proxy HTTP; un Proxy de JavaScript |
| **Tokens (de tema)** | Variables CSS semánticas (`surface`, `muted`, `primary`…) definidas en `globals.css` con `@theme inline`. No hay `tailwind.config`. | Tokens de autenticación; tokens de un LLM |
| **Walk-in / paciente de mostrador** | Paciente **no registrado** en la base de datos. El formulario de recetas permite emitir una receta sin seleccionar paciente; en ese caso no se sincroniza con el historial. | Paciente registrado con fila en `patients` |

## Ver también

- [`architecture.md`](./architecture.md) — visión general del sistema
- [`README.md`](./README.md) — hub de navegación
