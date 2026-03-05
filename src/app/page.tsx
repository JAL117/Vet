import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {
  categories,
  getCalculatorsByCategory,
} from "@/lib/calculators";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero / Welcome */}
      <section className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Bienvenido a <span className="text-primary">VetCalc</span>
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl">
          Herramientas de calculo clinico para profesionales veterinarios.
          Selecciona una calculadora o busca por nombre.
        </p>
      </section>

      {/* Search */}
      <section className="flex justify-center lg:justify-start">
        <SearchBar />
      </section>

      {/* Category cards */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Categorias
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category) => {
            const calcs = getCalculatorsByCategory(category.name);
            return (
              <div
                key={category.name}
                className={`rounded-xl border p-6 transition-colors hover:shadow-md ${category.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
                <p className="text-sm opacity-80 mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {calcs.map((calc) => (
                    <li key={calc.id}>
                      <Link
                        href={calc.path}
                        className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                      >
                        <span aria-hidden="true">{calc.icon}</span>
                        <span className="group-hover:underline">
                          {calc.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Acceso Rapido
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/documentos"
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Generar Documento
              </h3>
              <p className="text-sm text-muted">
                Crea informes y recetas en PDF
              </p>
            </div>
          </Link>

          <Link
            href="/referencia"
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Guia Rapida</h3>
              <p className="text-sm text-muted">
                Valores de referencia y tablas
              </p>
            </div>
          </Link>

          <Link
            href="/calculadoras/fluidoterapia"
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-2xl">
              <span aria-hidden="true">{"\u{1F6A8}"}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emergencias</h3>
              <p className="text-sm text-muted">
                Fluidoterapia y transfusion rapida
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
