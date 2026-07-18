"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NutritionPage() {
  const { t } = useLanguage();
  const p = t.pages.nutrition;

  const [weight, setWeight] = useState("");
  const [factorIdx, setFactorIdx] = useState(0);
  const [foodKcal, setFoodKcal] = useState("");
  const [result, setResult] = useState<{
    rer: number;
    der: number;
    grams: number | null;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const weightValue = parseFloat(weight);

    if (!weight || isNaN(weightValue) || weightValue <= 0) e.weight = t.common.errors.weightRequired;
    if (weightValue > 1000) e.weight = t.common.errors.weightMax;
    if (foodKcal && (isNaN(parseFloat(foodKcal)) || parseFloat(foodKcal) <= 0)) {
      e.foodKcal = p.foodDensityError;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const weightValue = parseFloat(weight);
    const rer = 70 * Math.pow(weightValue, 0.75);
    const der = rer * p.factors[factorIdx].value;

    let grams: number | null = null;
    if (foodKcal && parseFloat(foodKcal) > 0) {
      grams = der / parseFloat(foodKcal);
    }

    setResult({ rer, der, grams });
  }

  function clear() {
    setWeight("");
    setFactorIdx(0);
    setFoodKcal("");
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
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.activityFactor}</label>
              <select value={factorIdx} onChange={(e) => setFactorIdx(parseInt(e.target.value))}>
                {p.factors.map((f, i) => (
                  <option key={i} value={i}>
                    {f.label} (x{f.value})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.foodDensity} <span className="font-normal text-muted">({t.common.optional})</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 3.5" value={foodKcal} onChange={(e) => setFoodKcal(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kcal/g</span>
              </div>
              {errors.foodKcal && <p className="mt-1 text-sm text-danger">{errors.foodKcal}</p>}
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
                  <p className="text-sm text-muted">{p.rer}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {result.rer.toFixed(0)} <span className="text-sm font-medium text-muted">kcal/día</span>
                  </p>
                  <p className="text-xs text-muted mt-1">70 x {weight}^0.75</p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.der} ({p.factors[factorIdx].label})</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.der.toFixed(0)} <span className="text-sm font-medium">kcal/día</span>
                  </p>
                  <p className="text-xs text-muted mt-1">RER x {p.factors[factorIdx].value}</p>
                </div>
              </div>

              {result.grams !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.dailyFood}</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.grams.toFixed(0)} <span className="text-sm font-medium">g/día</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {p.portions} {(result.grams / 2).toFixed(0)}-{(result.grams / 3).toFixed(0)} {p.perPortion}
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
