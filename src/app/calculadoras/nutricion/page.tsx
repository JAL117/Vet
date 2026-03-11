"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NutricionPage() {
  const { t } = useLanguage();
  const p = t.pages.nutricion;

  const [peso, setPeso] = useState("");
  const [factorIdx, setFactorIdx] = useState(0);
  const [kcalAlimento, setKcalAlimento] = useState("");
  const [resultado, setResultado] = useState<{
    rer: number;
    der: number;
    gramos: number | null;
  } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const pv = parseFloat(peso);

    if (!peso || isNaN(pv) || pv <= 0) e.peso = t.common.errors.weightRequired;
    if (pv > 1000) e.peso = t.common.errors.weightMax;
    if (kcalAlimento && (isNaN(parseFloat(kcalAlimento)) || parseFloat(kcalAlimento) <= 0)) {
      e.kcalAlimento = p.foodDensityError;
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const pv = parseFloat(peso);
    const rer = 70 * Math.pow(pv, 0.75);
    const der = rer * p.factors[factorIdx].value;

    let gramos: number | null = null;
    if (kcalAlimento && parseFloat(kcalAlimento) > 0) {
      gramos = der / parseFloat(kcalAlimento);
    }

    setResultado({ rer, der, gramos });
  }

  function limpiar() {
    setPeso("");
    setFactorIdx(0);
    setKcalAlimento("");
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
                <input type="number" placeholder="Ej: 3.5" value={kcalAlimento} onChange={(e) => setKcalAlimento(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kcal/g</span>
              </div>
              {errores.kcalAlimento && <p className="mt-1 text-sm text-danger">{errores.kcalAlimento}</p>}
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
                  <p className="text-sm text-muted">{p.rer}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {resultado.rer.toFixed(0)} <span className="text-sm font-medium text-muted">kcal/día</span>
                  </p>
                  <p className="text-xs text-muted mt-1">70 x {peso}^0.75</p>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.der} ({p.factors[factorIdx].label})</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.der.toFixed(0)} <span className="text-sm font-medium">kcal/día</span>
                  </p>
                  <p className="text-xs text-muted mt-1">RER x {p.factors[factorIdx].value}</p>
                </div>
              </div>

              {resultado.gramos !== null && (
                <div className="mt-4 rounded-lg bg-surface p-4">
                  <p className="text-sm text-muted">{p.dailyFood}</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.gramos.toFixed(0)} <span className="text-sm font-medium">g/día</span>
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {p.portions} {(resultado.gramos / 2).toFixed(0)}-{(resultado.gramos / 3).toFixed(0)} {p.perPortion}
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
