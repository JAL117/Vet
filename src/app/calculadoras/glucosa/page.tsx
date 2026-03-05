"use client";

import { useState } from "react";
import Link from "next/link";

export default function GlucosaPage() {
  const [valor, setValor] = useState("");
  const [unidadOrigen, setUnidadOrigen] = useState<"mgdl" | "mmol">("mgdl");
  const [resultado, setResultado] = useState<{ valor: number; unidad: string } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const v = parseFloat(valor);

    if (!valor || isNaN(v) || v < 0) e.valor = "Ingrese un valor valido mayor o igual a 0";
    if (unidadOrigen === "mgdl" && v > 2000) e.valor = "El valor parece demasiado alto (max 2000 mg/dL)";
    if (unidadOrigen === "mmol" && v > 111) e.valor = "El valor parece demasiado alto (max 111 mmol/L)";

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const v = parseFloat(valor);

    if (unidadOrigen === "mgdl") {
      setResultado({ valor: v / 18.0182, unidad: "mmol/L" });
    } else {
      setResultado({ valor: v * 18.0182, unidad: "mg/dL" });
    }
  }

  function limpiar() {
    setValor("");
    setUnidadOrigen("mgdl");
    setResultado(null);
    setErrores({});
  }

  function getEstado(mgdl: number, especie: "perro" | "gato"): { texto: string; color: string } {
    const min = 74;
    const max = especie === "perro" ? 143 : 159;
    if (mgdl < min) return { texto: "Hipoglucemia", color: "text-danger" };
    if (mgdl > max) return { texto: "Hiperglucemia", color: "text-warning" };
    return { texto: "Normal", color: "text-success" };
  }

  const valorMgDl = unidadOrigen === "mgdl"
    ? parseFloat(valor) || 0
    : (parseFloat(valor) || 0) * 18.0182;

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
            Conversion de Glucosa
          </h1>
          <p className="mb-6 text-muted">
            Convierte valores de glucosa entre mg/dL y mmol/L. Incluye rangos de referencia para perros y gatos.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Unidad de origen</label>
              <select value={unidadOrigen} onChange={(e) => { setUnidadOrigen(e.target.value as "mgdl" | "mmol"); setResultado(null); }}>
                <option value="mgdl">mg/dL → mmol/L</option>
                <option value="mmol">mmol/L → mg/dL</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Valor de glucosa</label>
              <div className="relative">
                <input type="number" placeholder={unidadOrigen === "mgdl" ? "Ej: 100" : "Ej: 5.5"} value={valor} onChange={(e) => setValor(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  {unidadOrigen === "mgdl" ? "mg/dL" : "mmol/L"}
                </span>
              </div>
              {errores.valor && <p className="mt-1 text-sm text-danger">{errores.valor}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calcular} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              Convertir
            </button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              Limpiar
            </button>
          </div>

          {resultado && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Resultado
              </h2>
              <p className="text-3xl font-bold text-primary">
                {resultado.valor.toFixed(2)} <span className="text-lg font-medium">{resultado.unidad}</span>
              </p>
              <div className="mt-2 text-sm text-muted">
                {valor} {unidadOrigen === "mgdl" ? "mg/dL" : "mmol/L"} = {resultado.valor.toFixed(2)} {resultado.unidad}
              </div>
            </div>
          )}

          {/* Rangos de referencia */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Rangos de referencia
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-semibold text-foreground">Perro</p>
                <p className="text-sm text-muted">74 - 143 mg/dL</p>
                <p className="text-sm text-muted">4.11 - 7.94 mmol/L</p>
                {resultado && (
                  <p className={`text-sm font-semibold mt-1 ${getEstado(valorMgDl, "perro").color}`}>
                    {getEstado(valorMgDl, "perro").texto}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-semibold text-foreground">Gato</p>
                <p className="text-sm text-muted">74 - 159 mg/dL</p>
                <p className="text-sm text-muted">4.11 - 8.83 mmol/L</p>
                {resultado && (
                  <p className={`text-sm font-semibold mt-1 ${getEstado(valorMgDl, "gato").color}`}>
                    {getEstado(valorMgDl, "gato").texto}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
