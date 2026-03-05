"use client";

import { useState } from "react";
import Link from "next/link";

const factores = [
  { label: "Adulto neutro/esterilizado", valor: 1.6 },
  { label: "Cachorro (< 4 meses)", valor: 3.0 },
  { label: "Cachorro (4-12 meses)", valor: 2.0 },
  { label: "Geriatrico", valor: 1.4 },
  { label: "Obesidad / Perdida de peso", valor: 1.0 },
  { label: "Gestacion (primeras 6 semanas)", valor: 1.8 },
  { label: "Gestacion (ultimas 3 semanas)", valor: 3.0 },
  { label: "Lactancia", valor: 4.0 },
  { label: "Lactancia (alta demanda)", valor: 8.0 },
  { label: "Trabajo ligero", valor: 2.0 },
  { label: "Trabajo moderado", valor: 3.0 },
  { label: "Trabajo pesado", valor: 5.0 },
  { label: "Ganancia de peso", valor: 1.2 },
  { label: "Enfermo hospitalizado", valor: 1.0 },
  { label: "Enfermo hospitalizado (activo)", valor: 1.2 },
];

export default function NutricionPage() {
  const [peso, setPeso] = useState("");
  const [factorIdx, setFactorIdx] = useState(0);
  const [kcalAlimento, setKcalAlimento] = useState("");
  const [resultado, setResultado] = useState<{
    rer: number;
    der: number;
    gramos: number | null;
  } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const p = parseFloat(peso);

    if (!peso || isNaN(p) || p <= 0) e.peso = "Ingrese un peso valido mayor a 0";
    if (p > 1000) e.peso = "El peso parece demasiado alto (max 1000 kg)";
    if (kcalAlimento && (isNaN(parseFloat(kcalAlimento)) || parseFloat(kcalAlimento) <= 0)) {
      e.kcalAlimento = "Ingrese un valor calorico valido";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const rer = 70 * Math.pow(p, 0.75);
    const der = rer * factores[factorIdx].valor;

    let gramos: number | null = null;
    if (kcalAlimento && parseFloat(kcalAlimento) > 0) {
      gramos = der / parseFloat(kcalAlimento);
    }

    setResultado({ rer, der, gramos });
  }

  function limpiar() {
    setPeso("");
    setFactorIdx(0);
    setKcalAlimento("");
    setResultado(null);
    setErrores({});
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Volver al inicio
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            Nutricion (RER/DER)
          </h1>
          <p className="mb-6 text-muted">
            Calcula los requerimientos energeticos en reposo (RER) y diarios (DER) segun la condicion del paciente.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Peso del paciente</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={peso} onChange={(e) => setPeso(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kg</span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Condicion / Factor de actividad</label>
              <select value={factorIdx} onChange={(e) => setFactorIdx(parseInt(e.target.value))}>
                {factores.map((f, i) => (
                  <option key={i} value={i}>
                    {f.label} (x{f.valor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Densidad calorica del alimento <span className="font-normal text-muted">(opcional)</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 3.5" value={kcalAlimento} onChange={(e) => setKcalAlimento(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kcal/g</span>
              </div>
              {errores.kcalAlimento && <p className="mt-1 text-sm text-danger">{errores.kcalAlimento}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calcular} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              Calcular
            </button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              Limpiar
            </button>
          </div>

          {resultado && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
                Resultados
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">RER (Reposo)</p>
                  <p className="text-2xl font-bold text-foreground">
                    {resultado.rer.toFixed(0)} <span className="text-sm font-medium text-muted">kcal/dia</span>
                  </p>
                  <p className="text-xs text-muted mt-1">70 x {peso}^0.75</p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">DER ({factores[factorIdx].label})</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.der.toFixed(0)} <span className="text-sm font-medium">kcal/dia</span>
                  </p>
                  <p className="text-xs text-muted mt-1">RER x {factores[factorIdx].valor}</p>
                </div>
              </div>

              {resultado.gramos !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Cantidad de alimento diaria</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.gramos.toFixed(0)} <span className="text-sm font-medium">g/dia</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    Dividir en 2-3 raciones: {(resultado.gramos / 2).toFixed(0)}-{(resultado.gramos / 3).toFixed(0)} g por racion
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
