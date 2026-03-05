import Link from "next/link";
import {
  calculators,
  categories,
  getCalculatorsByCategory,
} from "@/lib/calculators";
import type { CategoryInfo } from "@/lib/calculators";

export const metadata = {
  title: "Calculadoras - VetCalc",
  description:
    "Todas las calculadoras veterinarias disponibles organizadas por categoria",
};

function CategorySection({ category }: { category: CategoryInfo }) {
  const items = getCalculatorsByCategory(category.name);
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${category.color}`}
        >
          <span className="text-base">{category.icon}</span>
          {category.name}
        </span>
        <p className="text-sm text-muted">{category.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((calc) => (
          <Link
            key={calc.id}
            href={calc.path}
            className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
          >
            <div className="mb-3 text-3xl">{calc.icon}</div>
            <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {calc.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {calc.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function CalculadorasPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </Link>

        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Calculadoras Veterinarias
          </h1>
          <p className="text-lg text-muted">
            {calculators.length} herramientas de calculo organizadas por
            categoria para la practica clinica diaria.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted">
          <p>
            Todos los calculos se realizan localmente en su navegador.{" "}
            <Link href="/disclaimer" className="text-primary hover:underline">
              Ver aviso legal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
