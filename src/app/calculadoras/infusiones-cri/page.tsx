"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function InfusionesCRIPage() {
  const { t } = useLanguage();
  const p = t.pages.infusionesCri;

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
    const pv = parseFloat(peso);
    const d = parseFloat(dosis);
    const c = parseFloat(concentracion);

    if (!peso || isNaN(pv) || pv <= 0) e.peso = t.common.errors.weightRequired;
    if (pv > 1000) e.peso = t.common.errors.weightMax;
    if (!dosis || isNaN(d) || d <= 0) e.dosis = p.doseError;
    if (!concentracion || isNaN(c) || c <= 0) e.concentracion = p.concentrationError;
    if (volumenSuero && (isNaN(parseFloat(volumenSuero)) || parseFloat(volumenSuero) <= 0)) {
      e.volumenSuero = p.serumVolumeError;
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const pv = parseFloat(peso);
    const d = parseFloat(dosis);
    const c = parseFloat(concentracion);
    const vs = volumenSuero ? parseFloat(volumenSuero) : null;

    // dosis en mcg/kg/min -> mg/hora: (peso * dosis * 60) / 1000
    const mgPorHora = (pv * d * 60) / 1000;
    const mlPorHora = mgPorHora / c;

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
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          {t.common.back}
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            {p.title}
          </h1>
          <p className="mb-6 text-muted">
            {p.subtitle}
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.weight}</label>
              <div className="relative">
                <input type="number" placeholder={t.common.weightPlaceholder} value={peso} onChange={(e) => setPeso(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">{t.common.kg}</span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.dose}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={dosis} onChange={(e) => setDosis(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mcg/kg/min</span>
              </div>
              {errores.dosis && <p className="mt-1 text-sm text-danger">{errores.dosis}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.concentration}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 50" value={concentracion} onChange={(e) => setConcentracion(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/ml</span>
              </div>
              {errores.concentracion && <p className="mt-1 text-sm text-danger">{errores.concentracion}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.serumVolume} <span className="font-normal text-muted">({t.common.optional}, {p.serumVolumeNote})</span>
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
              {t.common.calculate}
            </button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              {t.common.clear}
            </button>
          </div>

          {resultado && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.results}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.dosePerHour}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {resultado.mgPorHora.toFixed(3)} <span className="text-sm font-medium text-muted">mg/h</span>
                  </p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.infusionRate}</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.mlPorHora.toFixed(3)} <span className="text-sm font-medium">ml/h</span>
                  </p>
                </div>
              </div>

              {resultado.agregarAlSuero !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.addToSerum} {volumenSuero} {p.forDay}</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.agregarAlSuero.toFixed(2)} <span className="text-sm font-medium">mg</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {(resultado.agregarAlSuero / parseFloat(concentracion)).toFixed(2)} ml {p.drugVolume}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {p.serumRate} {(parseFloat(volumenSuero) / 24).toFixed(1)} ml/h
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> ({peso} kg x {dosis} mcg/kg/min x 60) / 1000 = {resultado.mgPorHora.toFixed(3)} mg/h
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
