"use client";

import { useState } from "react";
import Link from "next/link";

export default function DosisPesoPage() {
  const [peso, setPeso] = useState("");
  const [dosis, setDosis] = useState("");
  const [concentracion, setConcentracion] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const p = parseFloat(peso);
    const d = parseFloat(dosis);
    const c = parseFloat(concentracion);

    if (!peso || isNaN(p) || p <= 0) e.peso = "Ingrese un peso valido mayor a 0";
    if (p > 1000) e.peso = "El peso parece demasiado alto (max 1000 kg)";
    if (!dosis || isNaN(d) || d <= 0) e.dosis = "Ingrese una dosis valida mayor a 0";
    if (!concentracion || isNaN(c) || c <= 0) e.concentracion = "Ingrese una concentracion valida mayor a 0";

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const d = parseFloat(dosis);
    const c = parseFloat(concentracion);
    setResultado((p * d) / c);
  }

  function limpiar() {
    setPeso("");
    setDosis("");
    setConcentracion("");
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
            Dosis por Peso
          </h1>
          <p className="mb-6 text-muted">
            Calcula el volumen a administrar de un farmaco segun el peso del paciente, la dosis recomendada y la concentracion del farmaco.
          </p>

          <div className="space-y-5">
            {/* Peso */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Peso del paciente
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ej: 10"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  kg
                </span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>

            {/* Dosis */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Dosis recomendada
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={dosis}
                  onChange={(e) => setDosis(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  mg/kg
                </span>
              </div>
              {errores.dosis && <p className="mt-1 text-sm text-danger">{errores.dosis}</p>}
            </div>

            {/* Concentracion */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Concentracion del farmaco
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ej: 50"
                  value={concentracion}
                  onChange={(e) => setConcentracion(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  mg/ml
                </span>
              </div>
              {errores.concentracion && <p className="mt-1 text-sm text-danger">{errores.concentracion}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={calcular}
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
            >
              Calcular
            </button>
            <button
              onClick={limpiar}
              className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover"
            >
              Limpiar
            </button>
          </div>

          {/* Resultado */}
          {resultado !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Resultado
              </h2>
              <p className="text-3xl font-bold text-primary">
                {resultado.toFixed(2)} <span className="text-lg font-medium">ml</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                Volumen a administrar
              </p>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>Formula:</strong> ({peso} kg x {dosis} mg/kg) / {concentracion} mg/ml = {resultado.toFixed(2)} ml
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
