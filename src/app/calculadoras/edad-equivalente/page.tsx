"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Tamano = "pequeno" | "mediano" | "grande" | "gigante";

export default function EdadEquivalentePage() {
  const { t } = useLanguage();
  const p = t.pages.edadEquivalente;

  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [tamano, setTamano] = useState<Tamano>("mediano");
  const [edad, setEdad] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const ed = parseFloat(edad);

    if (!edad || isNaN(ed) || ed <= 0) e.edad = p.ageError;
    if (ed > 30) e.edad = p.ageMax;

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcularEdadHumana(): number {
    const ed = parseFloat(edad);

    if (especie === "gato") {
      if (ed <= 1) return ed * 15;
      if (ed <= 2) return 15 + (ed - 1) * 9;
      return 24 + (ed - 2) * 4;
    }

    // Perro - formula logaritmica
    let offset: number;
    switch (tamano) {
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

    if (ed < 1) {
      return ed * (16 * Math.log(1) + offset);
    }

    return 16 * Math.log(ed) + offset;
  }

  function calcular() {
    if (!validar()) return;
    setResultado(calcularEdadHumana());
  }

  function limpiar() {
    setEspecie("perro");
    setTamano("mediano");
    setEdad("");
    setResultado(null);
    setErrores({});
  }

  function getEtapaVida(edadHumana: number): string {
    if (edadHumana < 15) return p.stages.puppy;
    if (edadHumana < 25) return p.stages.adolescent;
    if (edadHumana < 40) return p.stages.youngAdult;
    if (edadHumana < 55) return p.stages.adult;
    if (edadHumana < 70) return p.stages.olderAdult;
    if (edadHumana < 85) return p.stages.senior;
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
              <select value={especie} onChange={(e) => { setEspecie(e.target.value as "perro" | "gato"); setResultado(null); }}>
                <option value="perro">{t.common.dog}</option>
                <option value="gato">{t.common.cat}</option>
              </select>
            </div>

            {especie === "perro" && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">{p.size}</label>
                <select value={tamano} onChange={(e) => { setTamano(e.target.value as Tamano); setResultado(null); }}>
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
                <input type="number" placeholder="Ej: 5" value={edad} onChange={(e) => setEdad(e.target.value)} min="0" max="30" step="0.5" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">{p.ageUnit}</span>
              </div>
              {errores.edad && <p className="mt-1 text-sm text-danger">{errores.edad}</p>}
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

          {resultado !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t.common.result}
              </h2>
              <p className="text-4xl font-bold text-primary">
                ~{Math.round(resultado)} <span className="text-lg font-medium">{p.humanYears}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {especie === "perro" ? t.common.dog : t.common.cat} {edad} {p.ageUnit}{especie === "perro" ? ` (${tamano})` : ""} {p.equivalent} {Math.round(resultado)} {p.humanYears}.
              </p>
              <div className="mt-3 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
                {p.lifeStage} {getEtapaVida(resultado)}
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
