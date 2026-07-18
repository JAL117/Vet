export type CalculatorCategory =
  | "Emergency"
  | "Pharmacology"
  | "Nutrition"
  | "General";

export interface Calculator {
  id: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  path: string;
  icon: string; // Nombre del ícono de Lucide
}

export interface CategoryInfo {
  name: CalculatorCategory;
  icon: string; // Nombre del ícono de Lucide
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    name: "Emergency",
    icon: "alert-circle",
    description: "Calculadoras para situaciones de emergencia veterinaria",
  },
  {
    name: "Pharmacology",
    icon: "pill",
    description: "Dosificacion y administracion de farmacos",
  },
  {
    name: "Nutrition",
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
    id: "dose-by-weight",
    name: "Dosis por Peso",
    description: "Calcula la dosis de medicamento segun el peso del paciente",
    category: "Pharmacology",
    path: "/calculators/dose-by-weight",
    icon: "scale",
  },
  {
    id: "fluid-therapy",
    name: "Fluidoterapia",
    description: "Calcula tasas de fluidos intravenosos para rehidratacion y mantenimiento",
    category: "Emergency",
    path: "/calculators/fluid-therapy",
    icon: "droplets",
  },
  {
    id: "transfusion",
    name: "Transfusion Sanguinea",
    description: "Calcula el volumen necesario de sangre o hemoderivados para transfusion",
    category: "Emergency",
    path: "/calculators/transfusion",
    icon: "heart-pulse",
  },
  {
    id: "body-surface-area",
    name: "Superficie Corporal",
    description: "Calcula la superficie corporal para dosificacion quimioterapica",
    category: "Pharmacology",
    path: "/calculators/body-surface-area",
    icon: "scan-line",
  },
  {
    id: "cri-infusions",
    name: "Infusiones Continuas (CRI)",
    description: "Calcula tasas de infusion continua para farmacos intravenosos",
    category: "Pharmacology",
    path: "/calculators/cri-infusions",
    icon: "syringe",
  },
  {
    id: "nutrition",
    name: "Nutricion (RER/DER)",
    description: "Calcula requerimientos energeticos en reposo y diarios",
    category: "Nutrition",
    path: "/calculators/nutrition",
    icon: "utensils",
  },
  {
    id: "glucose",
    name: "Conversion de Glucosa",
    description: "Convierte valores de glucosa entre mg/dL y mmol/L",
    category: "General",
    path: "/calculators/glucose",
    icon: "trending-up",
  },
  {
    id: "age-equivalent",
    name: "Edad Humana Equivalente",
    description: "Estima la edad humana equivalente segun especie y raza",
    category: "General",
    path: "/calculators/age-equivalent",
    icon: "calendar-clock",
  },
  {
    id: "body-condition",
    name: "Score Condicion Corporal",
    description: "Evalua la condicion corporal del paciente en escala estandarizada",
    category: "Nutrition",
    path: "/calculators/body-condition",
    icon: "gauge",
  },
  {
    id: "gestation",
    name: "Tiempo de Gestacion",
    description: "Calcula fechas estimadas de parto segun especie y fecha de monta",
    category: "General",
    path: "/calculators/gestation",
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
