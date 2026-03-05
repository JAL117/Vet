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
  icon: string;
}

export interface CategoryInfo {
  name: CalculatorCategory;
  icon: string;
  description: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  {
    name: "Emergencias",
    icon: "\u{1F6A8}",
    description: "Calculadoras para situaciones de emergencia veterinaria",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  {
    name: "Farmacologia",
    icon: "\u{1F48A}",
    description: "Dosificacion y administracion de farmacos",
    color:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "Nutricion",
    icon: "\u{1F96B}",
    description: "Requerimientos nutricionales y condicion corporal",
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  {
    name: "General",
    icon: "\u{1F9EE}",
    description: "Herramientas de calculo general veterinario",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export const calculators: Calculator[] = [
  {
    id: "dosis-peso",
    name: "Dosis por Peso",
    description:
      "Calcula la dosis de medicamento segun el peso del paciente",
    category: "Farmacologia",
    path: "/calculadoras/dosis-peso",
    icon: "\u{2696}\u{FE0F}",
  },
  {
    id: "fluidoterapia",
    name: "Fluidoterapia",
    description:
      "Calcula tasas de fluidos intravenosos para rehidratacion y mantenimiento",
    category: "Emergencias",
    path: "/calculadoras/fluidoterapia",
    icon: "\u{1FA78}",
  },
  {
    id: "transfusion",
    name: "Transfusion Sanguinea",
    description:
      "Calcula el volumen necesario de sangre o hemoderivados para transfusion",
    category: "Emergencias",
    path: "/calculadoras/transfusion",
    icon: "\u{1FA78}",
  },
  {
    id: "superficie-corporal",
    name: "Superficie Corporal",
    description:
      "Calcula la superficie corporal para dosificacion quimioterapica",
    category: "Farmacologia",
    path: "/calculadoras/superficie-corporal",
    icon: "\u{1F4D0}",
  },
  {
    id: "infusiones-cri",
    name: "Infusiones Continuas (CRI)",
    description:
      "Calcula tasas de infusion continua para farmacos intravenosos",
    category: "Farmacologia",
    path: "/calculadoras/infusiones-cri",
    icon: "\u{1F489}",
  },
  {
    id: "nutricion",
    name: "Nutricion (RER/DER)",
    description:
      "Calcula requerimientos energeticos en reposo y diarios",
    category: "Nutricion",
    path: "/calculadoras/nutricion",
    icon: "\u{1F37D}\u{FE0F}",
  },
  {
    id: "glucosa",
    name: "Conversion de Glucosa",
    description:
      "Convierte valores de glucosa entre mg/dL y mmol/L",
    category: "General",
    path: "/calculadoras/glucosa",
    icon: "\u{1F4CA}",
  },
  {
    id: "edad-equivalente",
    name: "Edad Humana Equivalente",
    description:
      "Estima la edad humana equivalente segun especie y raza",
    category: "General",
    path: "/calculadoras/edad-equivalente",
    icon: "\u{1F4C5}",
  },
  {
    id: "condicion-corporal",
    name: "Score Condicion Corporal",
    description:
      "Evalua la condicion corporal del paciente en escala estandarizada",
    category: "Nutricion",
    path: "/calculadoras/condicion-corporal",
    icon: "\u{1F4CB}",
  },
  {
    id: "gestacion",
    name: "Tiempo de Gestacion",
    description:
      "Calcula fechas estimadas de parto segun especie y fecha de monta",
    category: "General",
    path: "/calculadoras/gestacion",
    icon: "\u{1F43E}",
  },
];

export function getCalculatorsByCategory(
  category: CalculatorCategory
): Calculator[] {
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

export function getCategoryInfo(
  category: CalculatorCategory
): CategoryInfo | undefined {
  return categories.find((cat) => cat.name === category);
}
