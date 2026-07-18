"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GestationPage() {
  const { t } = useLanguage();
  const p = t.pages.gestation;

  const [species, setSpecies] = useState<"perro" | "gato">("perro");
  const [matingDate, setMatingDate] = useState("");
  const [result, setResult] = useState<{
    dueDate: Date;
    minDate: Date;
    maxDate: Date;
    elapsedDays: number;
    remainingDays: number;
    trimester: number;
    progress: number;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!matingDate) {
      e.matingDate = p.errorNoDate;
    } else {
      const date = new Date(matingDate);
      const today = new Date();
      if (date > today) e.matingDate = p.errorFutureDate;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calculate() {
    if (!validate()) return;

    const date = new Date(matingDate);
    const today = new Date();

    const gestationDays = species === "perro" ? 63 : 65;
    const minRange = species === "perro" ? 58 : 60;
    const maxRange = species === "perro" ? 68 : 70;

    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + gestationDays);

    const minDate = new Date(date);
    minDate.setDate(minDate.getDate() + minRange);

    const maxDate = new Date(date);
    maxDate.setDate(maxDate.getDate() + maxRange);

    const elapsedDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, gestationDays - elapsedDays);

    let trimester: number;
    if (elapsedDays <= gestationDays / 3) trimester = 1;
    else if (elapsedDays <= (gestationDays * 2) / 3) trimester = 2;
    else trimester = 3;

    const progress = Math.min(100, (elapsedDays / gestationDays) * 100);

    setResult({
      dueDate,
      minDate,
      maxDate,
      elapsedDays,
      remainingDays,
      trimester,
      progress,
    });
  }

  function clear() {
    setSpecies("perro");
    setMatingDate("");
    setResult(null);
    setErrors({});
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                <option value="perro">{p.dogOption}</option>
                <option value="gato">{p.catOption}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.matingDate}</label>
              <input
                type="date"
                value={matingDate}
                onChange={(e) => setMatingDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-lg text-foreground transition-colors focus:border-primary focus:outline-none"
              />
              {errors.matingDate && <p className="mt-1 text-sm text-danger">{errors.matingDate}</p>}
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

              {/* Fecha probable */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <p className="text-sm text-muted">{p.dueDate}</p>
                <p className="text-xl font-bold text-primary capitalize">
                  {formatDate(result.dueDate)}
                </p>
              </div>

              {/* Rango */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <p className="text-sm text-muted">{p.probableRange}</p>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {formatDate(result.minDate)} — {formatDate(result.maxDate)}
                </p>
              </div>

              {/* Barra de progreso */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">{p.progress}</span>
                  <span className="font-semibold text-foreground">{result.progress.toFixed(0)}%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, result.progress)}%` }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-3 text-center text-xs text-muted">
                  <span className={result.trimester === 1 ? "font-bold text-primary" : ""}>{p.t1}</span>
                  <span className={result.trimester === 2 ? "font-bold text-primary" : ""}>{p.t2}</span>
                  <span className={result.trimester === 3 ? "font-bold text-primary" : ""}>{p.t3}</span>
                </div>
              </div>

              {/* Dias */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.elapsed}</p>
                  <p className="text-2xl font-bold text-foreground">{result.elapsedDays}</p>
                </div>
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.remaining}</p>
                  <p className="text-2xl font-bold text-primary">{result.remainingDays}</p>
                </div>
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.trimester}</p>
                  <p className="text-2xl font-bold text-foreground">{result.trimester}ro</p>
                </div>
              </div>

              {result.elapsedDays > (species === "perro" ? 68 : 70) && (
                <div className="mt-3 rounded-lg bg-danger/10 border border-danger/30 p-3 text-sm text-foreground">
                  <strong>{t.common.warning}</strong> {p.overdueWarning}
                </div>
              )}

              {result.progress >= 85 && result.progress <= 100 && (
                <div className="mt-3 rounded-lg bg-warning/10 border border-warning/30 p-3 text-sm text-foreground">
                  <strong>{t.common.reminder}</strong> {p.imminentReminder}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
