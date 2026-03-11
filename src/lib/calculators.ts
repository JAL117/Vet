export type CalculatorCategory =
  | "Emergencias"
  | "Farmacologia"
  | "Nutricion"
  | "General";

export interface Calculator {
  id: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  path: string;
  icon: string; // Lucide icon name
}

export interface CategoryInfo {
  name: CalculatorCategory;
  icon: string; // Lucide icon name
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    name: "Emergencias",
    icon: "alert-circle",
    description: "Calculadoras para situaciones de emergencia veterinaria",
  },
  {
    name: "Farmacologia",
    icon: "pill",
    description: "Dosificacion y administracion de farmacos",
  },
  {
    name: "Nutricion",
    icon: "apple",
    description: "Requerimientos nutricionales y condicion corporal",
  },
  {
    name: "General",
    icon: "bar-chart-2",
    description: "Herramientas de calculo general veterinario",
  },
];

export const calculators: Calculator[] = [
  {
    id: "dosis-peso",
    name: "Dosis por Peso",
    description: "Calcula la dosis de medicamento segun el peso del paciente",
    category: "Farmacologia",
    path: "/calculadoras/dosis-peso",
    icon: "scale",
  },
  {
    id: "fluidoterapia",
    name: "Fluidoterapia",
    description: "Calcula tasas de fluidos intravenosos para rehidratacion y mantenimiento",
    category: "Emergencias",
    path: "/calculadoras/fluidoterapia",
    icon: "droplets",
  },
  {
    id: "transfusion",
    name: "Transfusion Sanguinea",
    description: "Calcula el volumen necesario de sangre o hemoderivados para transfusion",
    category: "Emergencias",
    path: "/calculadoras/transfusion",
    icon: "heart-pulse",
  },
  {
    id: "superficie-corporal",
    name: "Superficie Corporal",
    description: "Calcula la superficie corporal para dosificacion quimioterapica",
    category: "Farmacologia",
    path: "/calculadoras/superficie-corporal",
    icon: "scan-line",
  },
  {
    id: "infusiones-cri",
    name: "Infusiones Continuas (CRI)",
    description: "Calcula tasas de infusion continua para farmacos intravenosos",
    category: "Farmacologia",
    path: "/calculadoras/infusiones-cri",
    icon: "syringe",
  },
  {
    id: "nutricion",
    name: "Nutricion (RER/DER)",
    description: "Calcula requerimientos energeticos en reposo y diarios",
    category: "Nutricion",
    path: "/calculadoras/nutricion",
    icon: "utensils",
  },
  {
    id: "glucosa",
    name: "Conversion de Glucosa",
    description: "Convierte valores de glucosa entre mg/dL y mmol/L",
    category: "General",
    path: "/calculadoras/glucosa",
    icon: "trending-up",
  },
  {
    id: "edad-equivalente",
    name: "Edad Humana Equivalente",
    description: "Estima la edad humana equivalente segun especie y raza",
    category: "General",
    path: "/calculadoras/edad-equivalente",
    icon: "calendar-clock",
  },
  {
    id: "condicion-corporal",
    name: "Score Condicion Corporal",
    description: "Evalua la condicion corporal del paciente en escala estandarizada",
    category: "Nutricion",
    path: "/calculadoras/condicion-corporal",
    icon: "gauge",
  },
  {
    id: "gestacion",
    name: "Tiempo de Gestacion",
    description: "Calcula fechas estimadas de parto segun especie y fecha de monta",
    category: "General",
    path: "/calculadoras/gestacion",
    icon: "baby",
  },
];

export function getCalculatorsByCategory(category: CalculatorCategory): Calculator[] {
  return calculators.filter((calc) => calc.category === category);
}

export function searchCalculators(query: string): Calculator[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return calculators;
  return calculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(normalizedQuery) ||
      calc.description.toLowerCase().includes(normalizedQuery) ||
      calc.category.toLowerCase().includes(normalizedQuery)
  );
}

export function getCategoryInfo(category: CalculatorCategory): CategoryInfo | undefined {
  return categories.find((cat) => cat.name === category);
}
