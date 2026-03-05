export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-amber-400/40 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p>
          <strong>Aviso:</strong> Esta herramienta es un apoyo al criterio
          clinico. Los resultados deben ser verificados por el profesional medico
          veterinario responsable. VetCalc no se hace responsable por decisiones
          clinicas basadas unicamente en estos calculos.
        </p>
      </div>
    </div>
  );
}
