"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Size = "pequeno" | "mediano" | "grande" | "gigante";

export default function AgeEquivalentPage() {
  const { t } = useLanguage();
  const p = t.pages.ageEquivalent;

  const [species, setSpecies] = useState<"perro" | "gato">("perro");
  const [size, setSize] = useState<Size>("mediano");
  const [age, setAge] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const ageValue = parseFloat(age);

    if (!age || isNaN(ageValue) || ageValue <= 0) e.age = p.ageError;
    if (ageValue > 30) e.age = p.ageMax;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculateHumanAge(): number {
    const ageValue = parseFloat(age);

    if (species === "gato") {
      if (ageValue <= 1) return ageValue * 15;
      if (ageValue <= 2) return 15 + (ageValue - 1) * 9;
      return 24 + (ageValue - 2) * 4;
    }

    // Perro - formula logaritmica
    let offset: number;
    switch (size) {
      case "pequeno":
      case "mediano":
        offset = 31;
        break;
      case "grande":
        offset = 28;
        break;
      case "gigante":
        offset = 25;
        break;
    }

    if (ageValue < 1) {
      return ageValue * (16 * Math.log(1) + offset);
    }

    return 16 * Math.log(ageValue) + offset;
  }

  function calculate() {
    if (!validate()) return;
    setResult(calculateHumanAge());
  }

  function clear() {
    setSpecies("perro");
    setSize("mediano");
    setAge("");
    setResult(null);
    setErrors({});
  }

  function getLifeStage(humanAge: number): string {
    if (humanAge < 15) return p.stages.puppy;
    if (humanAge < 25) return p.stages.adolescent;
    if (humanAge < 40) return p.stages.youngAdult;
    if (humanAge < 55) return p.stages.adult;
    if (humanAge < 70) return p.stages.olderAdult;
    if (humanAge < 85) return p.stages.senior;
    return p.stages.geriatric;
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
              <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.species}</label>
              <select value={species} onChange={(e) => { setSpecies(e.target.value as "perro" | "gato"); setResult(null); }}>
                <option value="perro">{t.common.dog}</option>
                <option value="gato">{t.common.cat}</option>
              </select>
            </div>

            {species === "perro" && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">{p.size}</label>
                <select value={size} onChange={(e) => { setSize(e.target.value as Size); setResult(null); }}>
                  <option value="pequeno">{p.small}</option>
                  <option value="mediano">{p.medium}</option>
                  <option value="grande">{p.large}</option>
                  <option value="gigante">{p.giant}</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.age}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 5" value={age} onChange={(e) => setAge(e.target.value)} min="0" max="30" step="0.5" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">{p.ageUnit}</span>
              </div>
              {errors.age && <p className="mt-1 text-sm text-danger">{errors.age}</p>}
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
              <p className="text-4xl font-bold text-primary">
                ~{Math.round(result)} <span className="text-lg font-medium">{p.humanYears}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {species === "perro" ? t.common.dog : t.common.cat} {age} {p.ageUnit}{species === "perro" ? ` (${size})` : ""} {p.equivalent} {Math.round(result)} {p.humanYears}.
              </p>
              <div className="mt-3 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
                {p.lifeStage} {getLifeStage(result)}
              </div>
            </div>
          )}

          {/* Tabla de referencia rapida */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              {p.lifeExpectancy}
            </h3>
            <div className="grid gap-2 text-sm">
              {p.lifeExpectancies.map((item, i) => (
                <div key={i} className="flex justify-between rounded-lg bg-background p-2">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
