"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TransfusionPage() {
  const { t } = useLanguage();
  const p = t.pages.transfusion;

  const [weight, setWeight] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [recipientHematocrit, setRecipientHematocrit] = useState("");
  const [desiredHematocrit, setDesiredHematocrit] = useState("");
  const [donorHematocrit, setDonorHematocrit] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const weightValue = parseFloat(weight);
    const recipientHct = parseFloat(recipientHematocrit);
    const desiredHct = parseFloat(desiredHematocrit);
    const donorHct = parseFloat(donorHematocrit);

    if (!weight || isNaN(weightValue) || weightValue <= 0) e.weight = t.common.errors.weightRequired;
    if (weightValue > 1000) e.weight = t.common.errors.weightMax;
    if (!recipientHematocrit || isNaN(recipientHct) || recipientHct < 0 || recipientHct > 100) e.recipientHematocrit = p.hctError;
    if (!desiredHematocrit || isNaN(desiredHct) || desiredHct < 0 || desiredHct > 100) e.desiredHematocrit = p.hctError;
    if (!donorHematocrit || isNaN(donorHct) || donorHct <= 0 || donorHct > 100) e.donorHematocrit = p.hctDonorError;
    if (!e.recipientHematocrit && !e.desiredHematocrit && desiredHct <= recipientHct) e.desiredHematocrit = p.hctDesiredError;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const weightValue = parseFloat(weight);
    const recipientHct = parseFloat(recipientHematocrit);
    const desiredHct = parseFloat(desiredHematocrit);
    const donorHct = parseFloat(donorHematocrit);
    // Factor de volemia: 90 ml/kg para perros, 70 ml/kg para gatos
    const volemiaFactor = species === "dog" ? 90 : 70;

    // Volumen a transfundir = (peso x volemia x (Hto deseado - Hto receptor)) / Hto donante
    const volume = (weightValue * volemiaFactor * (desiredHct - recipientHct)) / donorHct;
    setResult(volume);
  }

  function clear() {
    setWeight("");
    setSpecies("dog");
    setRecipientHematocrit("");
    setDesiredHematocrit("");
    setDonorHematocrit("");
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
                <option value="dog">{p.dogVolemia}</option>
                <option value="cat">{p.catVolemia}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.hctReceptor}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 15" value={recipientHematocrit} onChange={(e) => setRecipientHematocrit(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errors.recipientHematocrit && <p className="mt-1 text-sm text-danger">{errors.recipientHematocrit}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.hctDeseado}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 30" value={desiredHematocrit} onChange={(e) => setDesiredHematocrit(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errors.desiredHematocrit && <p className="mt-1 text-sm text-danger">{errors.desiredHematocrit}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.hctDonante}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 40" value={donorHematocrit} onChange={(e) => setDonorHematocrit(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errors.donorHematocrit && <p className="mt-1 text-sm text-danger">{errors.donorHematocrit}</p>}
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

          {result !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.result}
              </h2>
              <p className="text-3xl font-bold text-primary">
                {result.toFixed(1)} <span className="text-lg font-medium">ml</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {p.volumeLabel}
              </p>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> ({weight} kg x {species === "dog" ? "90" : "70"} ml/kg x ({desiredHematocrit}% - {recipientHematocrit}%)) / {donorHematocrit}% = {result.toFixed(1)} ml
              </div>
              <div className="mt-2 rounded-lg bg-warning/10 border border-warning/30 p-3 text-sm text-foreground">
                <strong>{t.common.note}</strong> {p.rateNote}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
