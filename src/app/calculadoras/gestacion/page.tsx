"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GestacionPage() {
  const { t } = useLanguage();
  const p = t.pages.gestacion;

  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [fechaMonta, setFechaMonta] = useState("");
  const [resultado, setResultado] = useState<{
    fechaParto: Date;
    fechaMin: Date;
    fechaMax: Date;
    diasTranscurridos: number;
    diasRestantes: number;
    trimestre: number;
    progreso: number;
  } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};

    if (!fechaMonta) {
      e.fechaMonta = p.errorNoDate;
    } else {
      const fecha = new Date(fechaMonta);
      const hoy = new Date();
      if (fecha > hoy) e.fechaMonta = p.errorFutureDate;
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;

    const fecha = new Date(fechaMonta);
    const hoy = new Date();

    const gestacionDias = especie === "perro" ? 63 : 65;
    const rangoMin = especie === "perro" ? 58 : 60;
    const rangoMax = especie === "perro" ? 68 : 70;

    const fechaParto = new Date(fecha);
    fechaParto.setDate(fechaParto.getDate() + gestacionDias);

    const fechaMin = new Date(fecha);
    fechaMin.setDate(fechaMin.getDate() + rangoMin);

    const fechaMax = new Date(fecha);
    fechaMax.setDate(fechaMax.getDate() + rangoMax);

    const diasTranscurridos = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    const diasRestantes = Math.max(0, gestacionDias - diasTranscurridos);

    let trimestre: number;
    if (diasTranscurridos <= gestacionDias / 3) trimestre = 1;
    else if (diasTranscurridos <= (gestacionDias * 2) / 3) trimestre = 2;
    else trimestre = 3;

    const progreso = Math.min(100, (diasTranscurridos / gestacionDias) * 100);

    setResultado({
      fechaParto,
      fechaMin,
      fechaMax,
      diasTranscurridos,
      diasRestantes,
      trimestre,
      progreso,
    });
  }

  function limpiar() {
    setEspecie("perro");
    setFechaMonta("");
    setResultado(null);
    setErrores({});
  }

  function formatFecha(fecha: Date): string {
    return fecha.toLocaleDateString("es-ES", {
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
              <select value={especie} onChange={(e) => { setEspecie(e.target.value as "perro" | "gato"); setResultado(null); }}>
                <option value="perro">{p.dogOption}</option>
                <option value="gato">{p.catOption}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">{p.matingDate}</label>
              <input
                type="date"
                value={fechaMonta}
                onChange={(e) => setFechaMonta(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-lg text-foreground transition-colors focus:border-primary focus:outline-none"
              />
              {errores.fechaMonta && <p className="mt-1 text-sm text-danger">{errores.fechaMonta}</p>}
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

              {/* Fecha probable */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <p className="text-sm text-muted">{p.dueDate}</p>
                <p className="text-xl font-bold text-primary capitalize">
                  {formatFecha(resultado.fechaParto)}
                </p>
              </div>

              {/* Rango */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <p className="text-sm text-muted">{p.probableRange}</p>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {formatFecha(resultado.fechaMin)} — {formatFecha(resultado.fechaMax)}
                </p>
              </div>

              {/* Barra de progreso */}
              <div className="rounded-lg bg-surface p-4 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">{p.progress}</span>
                  <span className="font-semibold text-foreground">{resultado.progreso.toFixed(0)}%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, resultado.progreso)}%` }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-3 text-center text-xs text-muted">
                  <span className={resultado.trimestre === 1 ? "font-bold text-primary" : ""}>{p.t1}</span>
                  <span className={resultado.trimestre === 2 ? "font-bold text-primary" : ""}>{p.t2}</span>
                  <span className={resultado.trimestre === 3 ? "font-bold text-primary" : ""}>{p.t3}</span>
                </div>
              </div>

              {/* Dias */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.elapsed}</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.diasTranscurridos}</p>
                </div>
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.remaining}</p>
                  <p className="text-2xl font-bold text-primary">{resultado.diasRestantes}</p>
                </div>
                <div className="rounded-lg bg-surface p-4 text-center">
                  <p className="text-sm text-muted">{p.trimester}</p>
                  <p className="text-2xl font-bold text-foreground">{resultado.trimestre}ro</p>
                </div>
              </div>

              {resultado.diasTranscurridos > (especie === "perro" ? 68 : 70) && (
                <div className="mt-3 rounded-lg bg-danger/10 border border-danger/30 p-3 text-sm text-foreground">
                  <strong>{t.common.warning}</strong> {p.overdueWarning}
                </div>
              )}

              {resultado.progreso >= 85 && resultado.progreso <= 100 && (
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
