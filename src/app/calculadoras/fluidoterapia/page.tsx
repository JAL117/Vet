"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FluidoterapiaPage() {
  const { t } = useLanguage();
  const p = t.pages.fluidoterapia;

  const [peso, setPeso] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [deshidratacion, setDeshidratacion] = useState("");
  const [tipoEquipo, setTipoEquipo] = useState<"macro" | "micro">("macro");
  const [resultado, setResultado] = useState<{ mantenimiento: number; deficit: number; total24h: number; gotasMin: number } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const pv = parseFloat(peso);
    const d = parseFloat(deshidratacion);
    if (!peso || isNaN(pv) || pv <= 0) e.peso = t.common.errors.weightRequired;
    if (pv > 1000) e.peso = t.common.errors.weightMax;
    if (!deshidratacion || isNaN(d) || d < 0) e.deshidratacion = p.dehydrationError;
    if (d > 15) e.deshidratacion = p.dehydrationMax;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const pv = parseFloat(peso);
    const d = parseFloat(deshidratacion);
    const factorMantenimiento = especie === "perro" ? 60 : 40;
    const factorGoteo = tipoEquipo === "macro" ? 20 : 60;
    const mantenimiento = pv * factorMantenimiento;
    const deficit = pv * (d / 100) * 1000;
    const total24h = mantenimiento + deficit;
    const gotasMin = (total24h / (24 * 60)) * factorGoteo;
    setResultado({ mantenimiento, deficit, total24h, gotasMin });
  }

  function limpiar() {
    setPeso(""); setEspecie("perro"); setDeshidratacion(""); setTipoEquipo("macro");
    setResultado(null); setErrores({});
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
                <input type="number" placeholder={t.common.weightPlaceholder} value={peso} onChange={(e) => setPeso(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">{t.common.kg}</span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.species}</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
                <option value="perro">{t.common.dog}</option>
                <option value="gato">{t.common.cat}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.dehydration}</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 5" value={deshidratacion} onChange={(e) => setDeshidratacion(e.target.value)} min="0" max="15" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errores.deshidratacion && <p className="mt-1 text-sm text-danger">{errores.deshidratacion}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.equipmentType}</label>
              <select value={tipoEquipo} onChange={(e) => setTipoEquipo(e.target.value as "macro" | "micro")}>
                <option value="macro">{p.macro}</option>
                <option value="micro">{p.micro}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calcular} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">{t.common.calculate}</button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">{t.common.clear}</button>
          </div>

          {resultado && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">{t.common.results}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.maintenance}</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.mantenimiento.toFixed(0)} <span className="text-sm font-medium text-muted">ml/día</span></p>
                  <p className="text-xs text-muted mt-1">{especie === "perro" ? "60" : "40"} ml/kg/día</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.deficit}</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.deficit.toFixed(0)} <span className="text-sm font-medium text-muted">ml</span></p>
                  <p className="text-xs text-muted mt-1">{peso} kg × {deshidratacion}% × 10</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.total24h}</p>
                  <p className="text-2xl font-bold text-primary">{resultado.total24h.toFixed(0)} <span className="text-sm font-medium">ml</span></p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-sm text-muted">{p.dropRate}</p>
                  <p className="text-2xl font-bold text-primary">{resultado.gotasMin.toFixed(1)} <span className="text-sm font-medium">gotas/min</span></p>
                  <p className="text-xs text-muted mt-1">{tipoEquipo === "macro" ? p.macrogoteo : p.microgoteo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
