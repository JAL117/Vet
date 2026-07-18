"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DoseByWeightPage() {
  const { t } = useLanguage();
  const p = t.pages.doseByWeight;

  const [weight, setWeight] = useState("");
  const [dose, setDose] = useState("");
  const [concentration, setConcentration] = useState("");
  const [result, setResult] = useState<number | null>(null);
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

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const c = parseFloat(concentration);
    setResult((w * d) / c);
  }

  function clear() {
    setWeight("");
    setDose("");
    setConcentration("");
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
            {/* Peso */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {t.common.weight}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder={t.common.weightPlaceholder}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  {t.common.kg}
                </span>
              </div>
              {errors.weight && <p className="mt-1 text-sm text-danger">{errors.weight}</p>}
            </div>

            {/* Dosis */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.dose}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  mg/kg
                </span>
              </div>
              {errors.dose && <p className="mt-1 text-sm text-danger">{errors.dose}</p>}
            </div>

            {/* Concentracion */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.concentration}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ej: 50"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  min="0"
                  step="any"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  mg/ml
                </span>
              </div>
              {errors.concentration && <p className="mt-1 text-sm text-danger">{errors.concentration}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={calculate}
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
            >
              {t.common.calculate}
            </button>
            <button
              onClick={clear}
              className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover"
            >
              {t.common.clear}
            </button>
          </div>

          {/* Resultado */}
          {result !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.result}
              </h2>
              <p className="text-3xl font-bold text-primary">
                {result.toFixed(2)} <span className="text-lg font-medium">ml</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {p.volumeLabel}
              </p>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> ({weight} kg x {dose} mg/kg) / {concentration} mg/ml = {result.toFixed(2)} ml
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
