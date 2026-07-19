# Recetas

Generador de recetas veterinarias en PDF (`/prescriptions`): un formulario único que se pre-llena con el perfil del veterinario y los datos de un paciente registrado, genera el PDF en el cliente con jsPDF y, si hay paciente seleccionado, sincroniza la consulta al historial clínico en Supabase.

## Arquitectura

```
┌─────────────────────────┐
│ Perfil del veterinario  │
│  1) localStorage        │  pawcure-vet-name / pawcure-vet-license (vía rápida)
│  2) Supabase `profiles` │  vet_name / vet_license (fuente autoritativa,
│                         │  reescribe el caché de localStorage)
└───────────┬─────────────┘
            │ prefill (veterinario, cedula)
            ▼
┌─────────────────────────┐     6 columnas, TODAS las filas, ordenadas por name
│ Búsqueda de paciente    │◄─── Supabase `patients`
│ autocomplete en memoria │
│ (opcional: walk-in OK)  │
└───────────┬─────────────┘
            │ prefill (paciente, especieRaza, peso, propietario)
            ▼
┌─────────────────────────┐
│ Formulario → generatePDF│  jsPDF imperativo, doc.save() → descarga local
│ (100% en el cliente,    │  Nada se sube al servidor.
│  solo español/claro)    │
└───────────┬─────────────┘
            │ solo si hay selectedPatient
            ▼
┌─────────────────────────┐
│ Sync al historial       │  INSERT en `clinical_records`
│ (`instructions` → notes)│  syncStatus: idle | saved | error → banners
└─────────────────────────┘
```

## Rutas

| Ruta | Archivo | Qué hace |
|------|---------|----------|
| `/prescriptions` | `src/app/prescriptions/page.tsx` | Formulario de receta, generación del PDF y sync al historial |
| `/documents` | `src/app/documents/page.tsx` | Stub: `redirect("/prescriptions")` (ruta heredada) |

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/app/prescriptions/page.tsx` | Todo el módulo: estado del formulario, carga de perfil, autocomplete de pacientes, `generatePDF` e inserción en `clinical_records` (~600 líneas, client component) |
| `src/components/ProfilePanel.tsx` | Panel de ajustes con el hook `useVetProfile` (edición/guardado del perfil) y el botón `data-profile-trigger` que esta página dispara por DOM |
| `src/app/documents/page.tsx` | Redirect a `/prescriptions` |
| `src/lib/supabase/client.ts` | Cliente Supabase de navegador usado para `profiles`, `patients` y `clinical_records` |
| `src/components/Disclaimer.tsx` | Aviso legal reutilizable mostrado al pie de la página |

## Flujo en 4 pasos

1. **Prefill del perfil.** Al montar, lee `pawcure-vet-name` y `pawcure-vet-license` de localStorage y los vuelca en `veterinario`/`cedula` (render instantáneo, sin esperar red). Después consulta `profiles` (`vet_name`, `vet_license`) en Supabase: si hay datos, reescribe el caché de localStorage y el formulario. Supabase es la fuente autoritativa; localStorage es solo la vía rápida.
2. **Búsqueda de paciente.** Un segundo `useEffect` carga **toda** la tabla `patients` (`id, name, species, breed, weight_kg, owner_name`) en memoria y el autocomplete filtra por nombre en el cliente. Seleccionar un paciente pre-llena `paciente`, `especieRaza`, `peso` y `propietario`. La selección es opcional: el formulario sigue siendo editable a mano para pacientes de mostrador (walk-in) que no están registrados.
3. **`generatePDF`.** Construye el documento imperativamente con jsPDF (helpers `addSection`, `addField`, `addMultilineField`), añade disclaimer y línea de firma, y lo descarga con `doc.save()`. **Todo ocurre en el navegador: nada del PDF se sube al servidor.**
4. **Sync al historial.** Solo si hay `selectedPatient`, tras guardar el PDF inserta una fila en `clinical_records` con `patient_id`, `user_id`, fecha, motivo, peso, temperatura, diagnóstico y tratamiento. Ojo con el mapeo: el campo `indicaciones` (instructions) del formulario se guarda en la columna `notes`. El resultado alimenta `syncStatus` (`idle | saved | error`), que controla los banners verde/rojo bajo el formulario.

## Decisiones de diseño

- **El PDF es solo español y solo tema claro.** Todos los strings ("RECETA VETERINARIA", "Firma del Medico Veterinario", el disclaimer…) y los colores RGB están hardcodeados dentro de `generatePDF`; la función ignora tanto `useLanguage` como el dark mode de la app. Los textos del PDF van deliberadamente sin acentos ("Diagnostico", "Cedula") por compatibilidad con la fuente helvetica por defecto de jsPDF (ASCII seguro). Un usuario en inglés o en tema oscuro recibe exactamente el mismo PDF.
- **Acoplamiento por DOM con el panel de perfil.** Cuando no hay perfil configurado, el botón "configurar perfil" hace `document.querySelector("[data-profile-trigger]").click()` para abrir el `ProfilePanel`. Es un enlace frágil: renombrar o quitar el atributo `data-profile-trigger` en `ProfilePanel.tsx` rompe el botón en silencio (no hay error, simplemente no pasa nada). No hay contexto ni prop compartida entre ambos componentes; si esto se vuelve a necesitar, conviene sustituirlo por estado compartido.
- **Carga la tabla `patients` entera en memoria.** El autocomplete no pagina ni filtra en el servidor: trae todas las filas y filtra con `Array.filter` en el cliente. Simple y suficiente para una clínica pequeña, pero escala mal con miles de pacientes (payload y memoria crecen linealmente).
- **Lógica duplicada de perfil.** El patrón "localStorage primero, luego `profiles` de Supabase, reescribiendo el caché" está implementado dos veces: aquí (solo lectura, en el `useEffect` de la página) y en `useVetProfile` de `ProfilePanel.tsx` (lectura y guardado). Comparten las claves de localStorage (`pawcure-vet-name`, `pawcure-vet-license`) como contrato implícito; cambiar las claves o el esquema exige tocar ambos archivos.
- **`/documents` es un stub.** El módulo vivía en `/documents` (las traducciones aún cuelgan de `t.pages.documents`); la ruta vieja solo redirige a `/prescriptions` para no romper enlaces existentes.

## Ver también

- [`../patients/clinical-records.md`](../patients/clinical-records.md) — documentación de la tabla `clinical_records` a la que sincroniza este módulo.
- [`../database/README.md`](../database/README.md) — esquema general de la base de datos (tablas `profiles`, `patients`, `clinical_records`).
