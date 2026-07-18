"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CriInfusionsPage() {
  const { t } = useLanguage();
  const p = t.pages.criInfusions;

  const [weight, setWeight] = useState("");
  const [dose, setDose] = useState("");
  const [concentration, setConcentration] = useState("");
  const [serumVolume, setSerumVolume] = useState("");
  const [result, setResult] = useState<{
    mgPerHour: number;
    mlPerHour: number;
    addToSerum: number | null;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const c = parseFloat(concentration);

    if (!weight || isNaN(w) || w <= 0) e.weight = t.common.errors.weightRequired;
    if (w > 1000) e.weight = t.common.errors.weightMax;
    if (!dose || isNaN(d) || d <= 0) e.dose = p.doseError;
    if (!concentration || isNaN(c) || c <= 0) e.concentration = p.concentrationError;
    if (serumVolume && (isNaN(parseFloat(serumVolume)) || parseFloat(serumVolume) <= 0)) {
      e.serumVolume = p.serumVolumeError;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const c = parseFloat(concentration);
    const sv = serumVolume ? parseFloat(serumVolume) : null;

    // dosis en mcg/kg/min -> mg/hora: (peso * dosis * 60) / 1000
    const mgPerHour = (w * d * 60) / 1000;
    const mlPerHour = mgPerHour / c;

    let addToSerum: number | null = null;
    if (sv) {
      addToSerum = mgPerHour * 24;
    }

    setResult({ mgPerHour, mlPerHour, addToSerum });
  }

  function clear() {
    setWeight("");
    setDose("");
    setConcentration("");
    setSerumVolume("");
    setResult(null);
    setErrors({});
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
                <input type="number" placeholder={t.common.weightPlaceholder} value={weight} onChange={(e) => setWeight(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">{t.common.kg}</span>
              </div>
              {errors.weight && <p className="mt-1 text-sm text-danger">{errors.weight}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.dose}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={dose} onChange={(e) => setDose(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mcg/kg/min</span>
              </div>
              {errors.dose && <p className="mt-1 text-sm text-danger">{errors.dose}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.concentration}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 50" value={concentration} onChange={(e) => setConcentration(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/ml</span>
              </div>
              {errors.concentration && <p className="mt-1 text-sm text-danger">{errors.concentration}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.serumVolume} <span className="font-normal text-muted">({t.common.optional}, {p.serumVolumeNote})</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 500" value={serumVolume} onChange={(e) => setSerumVolume(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">ml</span>
              </div>
              {errors.serumVolume && <p className="mt-1 text-sm text-danger">{errors.serumVolume}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calculate} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              {t.common.calculate}
            </button>
            <button onClick={clear} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              {t.common.clear}
            </button>
          </div>

          {result && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.results}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.dosePerHour}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {result.mgPerHour.toFixed(3)} <span className="text-sm font-medium text-muted">mg/h</span>
                  </p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.infusionRate}</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.mlPerHour.toFixed(3)} <span className="text-sm font-medium">ml/h</span>
                  </p>
                </div>
              </div>

              {result.addToSerum !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.addToSerum} {serumVolume} {p.forDay}</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.addToSerum.toFixed(2)} <span className="text-sm font-medium">mg</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {(result.addToSerum / parseFloat(concentration)).toFixed(2)} ml {p.drugVolume}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {p.serumRate} {(parseFloat(serumVolume) / 24).toFixed(1)} ml/h
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> ({weight} kg x {dose} mcg/kg/min x 60) / 1000 = {result.mgPerHour.toFixed(3)} mg/h
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
