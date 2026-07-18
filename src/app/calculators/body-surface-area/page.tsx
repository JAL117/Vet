"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BodySurfaceAreaPage() {
  const { t } = useLanguage();
  const p = t.pages.bodySurfaceArea;

  const [weight, setWeight] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [doseM2, setDoseM2] = useState("");
  const [result, setResult] = useState<{ bsa: number; totalDose: number | null } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const weightValue = parseFloat(weight);

    if (!weight || isNaN(weightValue) || weightValue <= 0) e.weight = t.common.errors.weightRequired;
    if (weightValue > 1000) e.weight = t.common.errors.weightMax;
    if (doseM2 && (isNaN(parseFloat(doseM2)) || parseFloat(doseM2) < 0)) {
      e.doseM2 = p.doseError;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const weightValue = parseFloat(weight);
    // Constante K: 10.1 para perros, 10.0 para gatos
    const k = species === "dog" ? 10.1 : 10.0;
    // Superficie corporal (m²) = (peso^0.667 x K) / 10000
    const bsa = (Math.pow(weightValue, 0.667) * k) / 10000;

    // Dosis total opcional a partir de la dosis por m²
    let totalDose: number | null = null;
    if (doseM2 && parseFloat(doseM2) > 0) {
      totalDose = bsa * parseFloat(doseM2);
    }

    setResult({ bsa, totalDose });
  }

  function clear() {
    setWeight("");
    setSpecies("dog");
    setDoseM2("");
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
              <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.species}</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value as "dog" | "cat")}>
                <option value="dog">{p.dogK}</option>
                <option value="cat">{p.catK}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.dosePerM2} <span className="font-normal text-muted">({t.common.optional})</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 30" value={doseM2} onChange={(e) => setDoseM2(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/m²</span>
              </div>
              {errors.doseM2 && <p className="mt-1 text-sm text-danger">{errors.doseM2}</p>}
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
                  <p className="text-sm text-muted">{p.bsa}</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.bsa.toFixed(4)} <span className="text-sm font-medium">m²</span>
                  </p>
                </div>
                {result.totalDose !== null && (
                  <div className="rounded-lg bg-surface p-4">
                    <p className="text-sm text-muted">{p.totalDose}</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.totalDose.toFixed(2)} <span className="text-sm font-medium">mg</span>
                    </p>
                    <p className="text-xs text-muted mt-1">{doseM2} mg/m² x {result.bsa.toFixed(4)} m²</p>
                  </div>
                )}
              </div>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> BSA = ({weight}^0.667 x {species === "dog" ? "10.1" : "10.0"}) / 10000 = {result.bsa.toFixed(4)} m²
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
