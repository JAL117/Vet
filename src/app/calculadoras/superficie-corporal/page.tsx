"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SuperficieCorporalPage() {
  const { t } = useLanguage();
  const p = t.pages.superficieCorporal;

  const [peso, setPeso] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [dosisM2, setDosisM2] = useState("");
  const [resultado, setResultado] = useState<{ bsa: number; dosisTotal: number | null } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const pv = parseFloat(peso);

    if (!peso || isNaN(pv) || pv <= 0) e.peso = t.common.errors.weightRequired;
    if (pv > 1000) e.peso = t.common.errors.weightMax;
    if (dosisM2 && (isNaN(parseFloat(dosisM2)) || parseFloat(dosisM2) < 0)) {
      e.dosisM2 = p.doseError;
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const pv = parseFloat(peso);
    const k = especie === "perro" ? 10.1 : 10.0;
    const bsa = (Math.pow(pv, 0.667) * k) / 10000;

    let dosisTotal: number | null = null;
    if (dosisM2 && parseFloat(dosisM2) > 0) {
      dosisTotal = bsa * parseFloat(dosisM2);
    }

    setResultado({ bsa, dosisTotal });
  }

  function limpiar() {
    setPeso("");
    setEspecie("perro");
    setDosisM2("");
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
              <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.species}</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
                <option value="perro">{p.dogK}</option>
                <option value="gato">{p.catK}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {p.dosePerM2} <span className="font-normal text-muted">({t.common.optional})</span>
              </label>
              <div className="relative">
                <input type="number" placeholder="Ej: 30" value={dosisM2} onChange={(e) => setDosisM2(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">mg/m²</span>
              </div>
              {errores.dosisM2 && <p className="mt-1 text-sm text-danger">{errores.dosisM2}</p>}
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
                  <p className="text-sm text-muted">{p.bsa}</p>
                  <p className="text-2xl font-bold text-primary">
                    {resultado.bsa.toFixed(4)} <span className="text-sm font-medium">m²</span>
                  </p>
                </div>
                {resultado.dosisTotal !== null && (
                  <div className="rounded-lg bg-surface p-4">
                    <p className="text-sm text-muted">{p.totalDose}</p>
                    <p className="text-2xl font-bold text-primary">
                      {resultado.dosisTotal.toFixed(2)} <span className="text-sm font-medium">mg</span>
                    </p>
                    <p className="text-xs text-muted mt-1">{dosisM2} mg/m² x {resultado.bsa.toFixed(4)} m²</p>
                  </div>
                )}
              </div>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>{t.common.formula}</strong> BSA = ({peso}^0.667 x {especie === "perro" ? "10.1" : "10.0"}) / 10000 = {resultado.bsa.toFixed(4)} m²
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
