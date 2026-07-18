"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GlucosePage() {
  const { t } = useLanguage();
  const p = t.pages.glucose;

  const [value, setValue] = useState("");
  const [sourceUnit, setSourceUnit] = useState<"mgdl" | "mmol">("mgdl");
  const [result, setResult] = useState<{ value: number; unit: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const v = parseFloat(value);

    if (!value || isNaN(v) || v < 0) e.value = p.errorInvalid;
    if (sourceUnit === "mgdl" && v > 2000) e.value = p.errorMaxMg;
    if (sourceUnit === "mmol" && v > 111) e.value = p.errorMaxMmol;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const v = parseFloat(value);

    if (sourceUnit === "mgdl") {
      setResult({ value: v / 18.0182, unit: "mmol/L" });
    } else {
      setResult({ value: v * 18.0182, unit: "mg/dL" });
    }
  }

  function clear() {
    setValue("");
    setSourceUnit("mgdl");
    setResult(null);
    setErrors({});
  }

  function getStatus(mgdl: number, species: "dog" | "cat"): { text: string; color: string } {
    const min = 74;
    const max = species === "dog" ? 143 : 159;
    if (mgdl < min) return { text: p.hypoglycemia, color: "text-danger" };
    if (mgdl > max) return { text: p.hyperglycemia, color: "text-warning" };
    return { text: p.normal, color: "text-success" };
  }

  const valueMgDl = sourceUnit === "mgdl"
    ? parseFloat(value) || 0
    : (parseFloat(value) || 0) * 18.0182;

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
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.unit}</label>
              <select value={sourceUnit} onChange={(e) => { setSourceUnit(e.target.value as "mgdl" | "mmol"); setResult(null); }}>
                <option value="mgdl">{p.mgToMmol}</option>
                <option value="mmol">{p.mmolToMg}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.value}</label>
              <div className="relative">
                <input type="number" placeholder={sourceUnit === "mgdl" ? p.placeholderMg : p.placeholderMmol} value={value} onChange={(e) => setValue(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                  {sourceUnit === "mgdl" ? "mg/dL" : "mmol/L"}
                </span>
              </div>
              {errors.value && <p className="mt-1 text-sm text-danger">{errors.value}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calculate} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              {t.common.convert}
            </button>
            <button onClick={clear} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              {t.common.clear}
            </button>
          </div>

          {result && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.result}
              </h2>
              <p className="text-3xl font-bold text-primary">
                {result.value.toFixed(2)} <span className="text-lg font-medium">{result.unit}</span>
              </p>
              <div className="mt-2 text-sm text-muted">
                {value} {sourceUnit === "mgdl" ? "mg/dL" : "mmol/L"} = {result.value.toFixed(2)} {result.unit}
              </div>
            </div>
          )}

          {/* Rangos de referencia */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              {p.referenceRanges}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-semibold text-foreground">{t.common.dog}</p>
                <p className="text-sm text-muted">74 - 143 mg/dL</p>
                <p className="text-sm text-muted">4.11 - 7.94 mmol/L</p>
                {result && (
                  <p className={`text-sm font-semibold mt-1 ${getStatus(valueMgDl, "dog").color}`}>
                    {getStatus(valueMgDl, "dog").text}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-semibold text-foreground">{t.common.cat}</p>
                <p className="text-sm text-muted">74 - 159 mg/dL</p>
                <p className="text-sm text-muted">4.11 - 8.83 mmol/L</p>
                {result && (
                  <p className={`text-sm font-semibold mt-1 ${getStatus(valueMgDl, "cat").color}`}>
                    {getStatus(valueMgDl, "cat").text}
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
