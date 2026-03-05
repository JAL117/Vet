"use client";

import { useState } from "react";
import Link from "next/link";

export default function SuperficieCorporalPage() {
  const [peso, setPeso] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [dosisM2, setDosisM2] = useState("");
  const [resultado, setResultado] = useState<{ bsa: number; dosisTotal: number | null } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const p = parseFloat(peso);

    if (!peso || isNaN(p) || p <= 0) e.peso = "Ingrese un peso valido mayor a 0";
    if (p > 1000) e.peso = "El peso parece demasiado alto (max 1000 kg)";
    if (dosisM2 && (isNaN(parseFloat(dosisM2)) || parseFloat(dosisM2) < 0)) {
      e.dosisM2 = "Ingrese una dosis valida";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const k = especie === "perro" ? 10.1 : 10.0;
    const bsa = (Math.pow(p, 0.667) * k) / 10000;

    let dosisTotal: number | null = null;
    if (dosisM2 && parseFloat(dosisM2) > 0) {
      dosisTotal = bsa * parseFloat(dosisM2);
    }

    setResultado({ bsa, dosisTotal });
  }

  function limpiar() {
    setPeso("");
    setEspecie("perro");
    setDosisM2("");
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
            Superficie Corporal (BSA)
          </h1>
          <p className="mb-6 text-muted">
            Calcula el area de superficie corporal para dosificacion de quimioterapicos y otros farmacos basados en m².
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
              <label className="mb-1 block text-sm font-semibold text-foreground">Especie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
                <option value="perro">Perro (K = 10.1)</option>
                <option value="gato">Gato (K = 10.0)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                Dosis por m² <span className="font-normal text-muted">(opcional)</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 30" value={dosisM2} onChange={(e) => setDosisM2(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/m²</span>
              </div>
              {errores.dosisM2 && <p className="mt-1 text-sm text-danger">{errores.dosisM2}</p>}
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
                  <p className="text-sm text-muted">Superficie corporal</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.bsa.toFixed(4)} <span className="text-sm font-medium">m²</span>
                  </p>
                </div>
                {resultado.dosisTotal !== null && (
                  <div className="rounded-lg bg-surface p-4">
                    <p className="text-sm text-muted">Dosis total</p>
                    <p className="text-2xl font-bold text-primary">
                      {resultado.dosisTotal.toFixed(2)} <span className="text-sm font-medium">mg</span>
                    </p>
                    <p className="text-xs text-muted mt-1">{dosisM2} mg/m² x {resultado.bsa.toFixed(4)} m²</p>
                  </div>
                )}
              </div>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>Formula:</strong> BSA = ({peso}^0.667 x {especie === "perro" ? "10.1" : "10.0"}) / 10000 = {resultado.bsa.toFixed(4)} m²
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
