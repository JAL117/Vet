"use client";

import { useState } from "react";
import Link from "next/link";

export default function InfusionesCRIPage() {
  const [peso, setPeso] = useState("");
  const [dosis, setDosis] = useState("");
  const [concentracion, setConcentracion] = useState("");
  const [volumenSuero, setVolumenSuero] = useState("");
  const [resultado, setResultado] = useState<{
    mgPorHora: number;
    mlPorHora: number;
    agregarAlSuero: number | null;
  } | null>(null);
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
    if (volumenSuero && (isNaN(parseFloat(volumenSuero)) || parseFloat(volumenSuero) <= 0)) {
      e.volumenSuero = "Ingrese un volumen valido";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const d = parseFloat(dosis);
    const c = parseFloat(concentracion);
    const vs = volumenSuero ? parseFloat(volumenSuero) : null;

    // dosis en mcg/kg/min -> mg/hora: (peso * dosis * 60) / 1000
    const mgPorHora = (p * d * 60) / 1000;
    const mlPorHora = mgPorHora / c;

    // Si se especifica volumen de suero, calcular cuanto farmaco agregar
    // Para que corra a una velocidad razonable (ej: velocidad mantenimiento)
    // Agregar al suero: mg necesarios = concentracion deseada en el suero
    // Si agregamos X mg al suero de V ml, la concentracion sera X/V mg/ml
    // Para administrar mgPorHora a velocidad mlPorHora del suero puro
    // Queremos que en 24h se administre todo: agregarAlSuero = mgPorHora * 24
    let agregarAlSuero: number | null = null;
    if (vs) {
      agregarAlSuero = mgPorHora * 24;
    }

    setResultado({ mgPorHora, mlPorHora, agregarAlSuero });
  }

  function limpiar() {
    setPeso("");
    setDosis("");
    setConcentracion("");
    setVolumenSuero("");
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
            Infusiones Continuas (CRI)
          </h1>
          <p className="mb-6 text-muted">
            Calcula la velocidad de infusion continua (Constant Rate Infusion) para farmacos que requieren administracion intravenosa constante.
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
              <label className="mb-1 block text-sm font-semibold text-foreground">Dosis</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={dosis} onChange={(e) => setDosis(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mcg/kg/min</span>
              </div>
              {errores.dosis && <p className="mt-1 text-sm text-danger">{errores.dosis}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Concentracion del farmaco</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 50" value={concentracion} onChange={(e) => setConcentracion(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/ml</span>
              </div>
              {errores.concentracion && <p className="mt-1 text-sm text-danger">{errores.concentracion}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Volumen del suero <span className="font-normal text-muted">(opcional, para calcular adicion al suero)</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 500" value={volumenSuero} onChange={(e) => setVolumenSuero(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">ml</span>
              </div>
              {errores.volumenSuero && <p className="mt-1 text-sm text-danger">{errores.volumenSuero}</p>}
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
                  <p className="text-sm text-muted">Dosis por hora</p>
                  <p className="text-2xl font-bold text-foreground">
                    {resultado.mgPorHora.toFixed(3)} <span className="text-sm font-medium text-muted">mg/h</span>
                  </p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Velocidad de infusion</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.mlPorHora.toFixed(3)} <span className="text-sm font-medium">ml/h</span>
                  </p>
                </div>
              </div>

              {resultado.agregarAlSuero !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Agregar al suero de {volumenSuero} ml (para 24h)</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.agregarAlSuero.toFixed(2)} <span className="text-sm font-medium">mg</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    = {(resultado.agregarAlSuero / parseFloat(concentracion)).toFixed(2)} ml del farmaco
                  </p>
                  <p className="text-sm text-muted mt-1">
                    Velocidad del suero: {(parseFloat(volumenSuero) / 24).toFixed(1)} ml/h
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>Formula:</strong> ({peso} kg x {dosis} mcg/kg/min x 60) / 1000 = {resultado.mgPorHora.toFixed(3)} mg/h
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
