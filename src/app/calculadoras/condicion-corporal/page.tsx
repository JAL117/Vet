"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Non-text data only (color, grasa values)
const scoresData = [
  { score: 1, color: "bg-red-500",    grasaPerro: "< 5%",    grasaGato: "< 5%"    },
  { score: 2, color: "bg-orange-500", grasaPerro: "5-10%",   grasaGato: "5-10%"   },
  { score: 3, color: "bg-yellow-500", grasaPerro: "10-15%",  grasaGato: "10-15%"  },
  { score: 4, color: "bg-lime-500",   grasaPerro: "15-20%",  grasaGato: "15-20%"  },
  { score: 5, color: "bg-green-500",  grasaPerro: "20-25%",  grasaGato: "20-25%"  },
  { score: 6, color: "bg-yellow-500", grasaPerro: "25-30%",  grasaGato: "25-30%"  },
  { score: 7, color: "bg-orange-500", grasaPerro: "30-35%",  grasaGato: "30-35%"  },
  { score: 8, color: "bg-red-400",    grasaPerro: "35-45%",  grasaGato: "35-40%"  },
  { score: 9, color: "bg-red-600",    grasaPerro: "> 45%",   grasaGato: "> 40%"   },
];

export default function CondicionCorporalPage() {
  const { t } = useLanguage();
  const p = t.pages.condicionCorporal;

  const [scoreSeleccionado, setScoreSeleccionado] = useState<number | null>(null);
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");

  const scoreData = scoreSeleccionado !== null ? scoresData[scoreSeleccionado - 1] : null;
  const scoreText = scoreSeleccionado !== null ? p.scores[scoreSeleccionado - 1] : null;

  function limpiar() {
    setScoreSeleccionado(null);
    setEspecie("perro");
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

          <div className="mb-5">
            <label className="mb-1 block text-sm font-semibold text-foreground">{t.common.species}</label>
            <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
              <option value="perro">{t.common.dog}</option>
              <option value="gato">{t.common.cat}</option>
            </select>
          </div>

          {/* Score selector */}
          <div className="mb-2">
            <label className="mb-2 block text-sm font-semibold text-foreground">{p.selectScore}</label>
            <div className="grid grid-cols-9 gap-1.5">
              {scoresData.map((s, i) => (
                <button
                  key={s.score}
                  onClick={() => setScoreSeleccionado(s.score)}
                  className={`relative flex flex-col items-center rounded-lg p-2 text-center transition-all ${
                    scoreSeleccionado === s.score
                      ? "ring-2 ring-primary bg-primary/10 scale-105"
                      : "bg-background hover:bg-surface-hover border border-border"
                  }`}
                >
                  <div className={`mb-1 h-3 w-3 rounded-full ${s.color}`} />
                  <span className="text-lg font-bold text-foreground">{s.score}</span>
                  <span className="hidden text-[10px] leading-tight text-muted sm:block">{p.scores[i].nombre.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>{p.scaleMin}</span>
              <span>{p.scaleMid}</span>
              <span>{p.scaleMax}</span>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover">
              {t.common.clear}
            </button>
          </div>

          {/* Resultado detallado */}
          {scoreData && scoreText && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-6 w-6 rounded-full ${scoreData.color}`} />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      BCS {scoreData.score}/9 - {scoreText.nombre}
                    </h2>
                    <p className="text-sm text-muted">{scoreText.descripcion}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-surface p-4 mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{p.characteristics}</h3>
                  <ul className="space-y-1.5">
                    {scoreText.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-surface p-4 mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{p.bodyFat}</h3>
                  <p className="text-2xl font-bold text-primary">
                    {especie === "perro" ? scoreData.grasaPerro : scoreData.grasaGato}
                  </p>
                </div>

                <div className="rounded-lg bg-surface p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{p.recommendation}</h3>
                  <p className="text-sm text-muted">{scoreText.recomendacion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
