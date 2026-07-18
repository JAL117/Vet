"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FluidTherapyPage() {
  const { t } = useLanguage();
  const p = t.pages.fluidTherapy;

  const [weight, setWeight] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [dehydration, setDehydration] = useState("");
  const [equipmentType, setEquipmentType] = useState<"macro" | "micro">("macro");
  const [result, setResult] = useState<{ maintenance: number; deficit: number; total24h: number; dropsPerMin: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const w = parseFloat(weight);
    const d = parseFloat(dehydration);
    if (!weight || isNaN(w) || w <= 0) e.weight = t.common.errors.weightRequired;
    if (w > 1000) e.weight = t.common.errors.weightMax;
    if (!dehydration || isNaN(d) || d < 0) e.dehydration = p.dehydrationError;
    if (d > 15) e.dehydration = p.dehydrationMax;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const w = parseFloat(weight);
    const d = parseFloat(dehydration);
    const maintenanceFactor = species === "dog" ? 60 : 40;
    const dropFactor = equipmentType === "macro" ? 20 : 60;
    const maintenance = w * maintenanceFactor;
    const deficit = w * (d / 100) * 1000;
    const total24h = maintenance + deficit;
    const dropsPerMin = (total24h / (24 * 60)) * dropFactor;
    setResult({ maintenance, deficit, total24h, dropsPerMin });
  }

  function clear() {
    setWeight(""); setSpecies("dog"); setDehydration(""); setEquipmentType("macro");
    setResult(null); setErrors({});
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> {t.common.back}
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">{p.title}</h1>
          <p className="mb-6 text-sm text-muted">{p.subtitle}</p>

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
                <option value="dog">{t.common.dog}</option>
                <option value="cat">{t.common.cat}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.dehydration}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 5" value={dehydration} onChange={(e) => setDehydration(e.target.value)} min="0" max="15" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errors.dehydration && <p className="mt-1 text-sm text-danger">{errors.dehydration}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.equipmentType}</label>
              <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value as "macro" | "micro")}>
                <option value="macro">{p.macro}</option>
                <option value="micro">{p.micro}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calculate} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">{t.common.calculate}</button>
            <button onClick={clear} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">{t.common.clear}</button>
          </div>

          {result && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">{t.common.results}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.maintenance}</p>
                  <p className="text-2xl font-bold text-foreground">{result.maintenance.toFixed(0)} <span className="text-sm font-medium text-muted">ml/día</span></p>
                  <p className="text-xs text-muted mt-1">{species === "dog" ? "60" : "40"} ml/kg/día</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.deficit}</p>
                  <p className="text-2xl font-bold text-foreground">{result.deficit.toFixed(0)} <span className="text-sm font-medium text-muted">ml</span></p>
                  <p className="text-xs text-muted mt-1">{weight} kg × {dehydration}% × 10</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.total24h}</p>
                  <p className="text-2xl font-bold text-primary">{result.total24h.toFixed(0)} <span className="text-sm font-medium">ml</span></p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.dropRate}</p>
                  <p className="text-2xl font-bold text-primary">{result.dropsPerMin.toFixed(1)} <span className="text-sm font-medium">gotas/min</span></p>
                  <p className="text-xs text-muted mt-1">{equipmentType === "macro" ? p.macrogoteo : p.microgoteo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
