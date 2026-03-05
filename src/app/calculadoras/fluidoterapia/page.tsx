"use client";

import { useState } from "react";
import Link from "next/link";

export default function FluidoterapiaPage() {
  const [peso, setPeso] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [deshidratacion, setDeshidratacion] = useState("");
  const [tipoEquipo, setTipoEquipo] = useState<"macro" | "micro">("macro");
  const [resultado, setResultado] = useState<{
    mantenimiento: number;
    deficit: number;
    total24h: number;
    gotasMin: number;
  } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const p = parseFloat(peso);
    const d = parseFloat(deshidratacion);

    if (!peso || isNaN(p) || p <= 0) e.peso = "Ingrese un peso valido mayor a 0";
    if (p > 1000) e.peso = "El peso parece demasiado alto (max 1000 kg)";
    if (!deshidratacion || isNaN(d) || d < 0) e.deshidratacion = "Ingrese un porcentaje valido";
    if (d > 15) e.deshidratacion = "El porcentaje de deshidratacion no puede superar 15%";

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const d = parseFloat(deshidratacion);
    const factorMantenimiento = especie === "perro" ? 60 : 40;
    const factorGoteo = tipoEquipo === "macro" ? 20 : 60;

    const mantenimiento = p * factorMantenimiento;
    const deficit = p * (d / 100) * 1000;
    const total24h = mantenimiento + deficit;
    const gotasMin = (total24h / (24 * 60)) * factorGoteo;

    setResultado({ mantenimiento, deficit, total24h, gotasMin });
  }

  function limpiar() {
    setPeso("");
    setEspecie("perro");
    setDeshidratacion("");
    setTipoEquipo("macro");
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
            Fluidoterapia
          </h1>
          <p className="mb-6 text-muted">
            Calcula los requerimientos de fluidoterapia: mantenimiento, deficit por deshidratacion, volumen total en 24 horas y velocidad de goteo.
          </p>

          <div className="space-y-5">
            {/* Peso */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Peso del paciente</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={peso} onChange={(e) => setPeso(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kg</span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>

            {/* Especie */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Especie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            {/* Deshidratacion */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Porcentaje de deshidratacion</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 5" value={deshidratacion} onChange={(e) => setDeshidratacion(e.target.value)} min="0" max="15" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errores.deshidratacion && <p className="mt-1 text-sm text-danger">{errores.deshidratacion}</p>}
            </div>

            {/* Tipo de equipo */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Tipo de equipo de infusion</label>
              <select value={tipoEquipo} onChange={(e) => setTipoEquipo(e.target.value as "macro" | "micro")}>
                <option value="macro">Macrogoteo (20 gotas/ml)</option>
                <option value="micro">Microgoteo (60 gotas/ml)</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button onClick={calcular} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              Calcular
            </button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              Limpiar
            </button>
          </div>

          {/* Resultado */}
          {resultado && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
                Resultados
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Mantenimiento</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.mantenimiento.toFixed(0)} <span className="text-sm font-medium text-muted">ml/dia</span></p>
                  <p className="text-xs text-muted mt-1">{especie === "perro" ? "60" : "40"} ml/kg/dia</p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Deficit</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.deficit.toFixed(0)} <span className="text-sm font-medium text-muted">ml</span></p>
                  <p className="text-xs text-muted mt-1">{peso} kg x {deshidratacion}% x 10</p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Total 24 horas</p>
                  <p className="text-2xl font-bold text-primary">{resultado.total24h.toFixed(0)} <span className="text-sm font-medium">ml</span></p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">Velocidad de goteo</p>
                  <p className="text-2xl font-bold text-primary">{resultado.gotasMin.toFixed(1)} <span className="text-sm font-medium">gotas/min</span></p>
                  <p className="text-xs text-muted mt-1">{tipoEquipo === "macro" ? "Macrogoteo" : "Microgoteo"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
