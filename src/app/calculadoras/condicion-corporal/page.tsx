"use client";

import { useState } from "react";
import Link from "next/link";

interface ScoreInfo {
  score: number;
  nombre: string;
  descripcion: string;
  caracteristicas: string[];
  grasaPerro: string;
  grasaGato: string;
  recomendacion: string;
  color: string;
}

const scores: ScoreInfo[] = [
  {
    score: 1,
    nombre: "Emaciado",
    descripcion: "Estado de desnutricion severa. Peligro vital.",
    caracteristicas: [
      "Costillas, vertebras y huesos pelvicos visibles a distancia",
      "Sin grasa corporal palpable",
      "Perdida evidente de masa muscular",
      "Sin cintura abdominal distinguible por caquexia",
    ],
    grasaPerro: "< 5%",
    grasaGato: "< 5%",
    recomendacion: "Atencion veterinaria urgente. Plan de realimentacion gradual supervisado. No sobrealimentar inicialmente (riesgo de sindrome de realimentacion).",
    color: "bg-red-500",
  },
  {
    score: 2,
    nombre: "Muy delgado",
    descripcion: "Peso muy por debajo del ideal. Requiere intervencion.",
    caracteristicas: [
      "Costillas facilmente visibles",
      "Sin grasa palpable",
      "Vertebras lumbares evidentes",
      "Cintura abdominal muy pronunciada",
    ],
    grasaPerro: "5-10%",
    grasaGato: "5-10%",
    recomendacion: "Aumentar ingesta calorica gradualmente (25-50% sobre DER actual). Evaluar causas subyacentes. Control en 2 semanas.",
    color: "bg-orange-500",
  },
  {
    score: 3,
    nombre: "Delgado",
    descripcion: "Ligeramente por debajo del peso ideal.",
    caracteristicas: [
      "Costillas facilmente palpables con minima cobertura grasa",
      "Vertebras lumbares visibles",
      "Cintura abdominal evidente vista desde arriba",
      "Pliegue abdominal evidente",
    ],
    grasaPerro: "10-15%",
    grasaGato: "10-15%",
    recomendacion: "Ligero aumento en la racion diaria (10-20%). Considerar alimento de mayor densidad calorica. Reevaluar en 4 semanas.",
    color: "bg-yellow-500",
  },
  {
    score: 4,
    nombre: "Bajo peso",
    descripcion: "Ligeramente por debajo del ideal pero aceptable.",
    caracteristicas: [
      "Costillas facilmente palpables con leve capa de grasa",
      "Cintura abdominal facilmente visible desde arriba",
      "Pliegue abdominal visible",
      "Masa muscular adecuada",
    ],
    grasaPerro: "15-20%",
    grasaGato: "15-20%",
    recomendacion: "Pequeno ajuste en la racion puede ser beneficioso. Monitorear peso mensualmente. Condicion aceptable.",
    color: "bg-lime-500",
  },
  {
    score: 5,
    nombre: "Ideal",
    descripcion: "Peso y condicion corporal optimos.",
    caracteristicas: [
      "Costillas palpables sin exceso de grasa",
      "Cintura visible detras de las costillas vista desde arriba",
      "Abdomen recogido visto de lado",
      "Buena masa muscular",
    ],
    grasaPerro: "20-25%",
    grasaGato: "20-25%",
    recomendacion: "Mantener la dieta actual y nivel de ejercicio. Control de peso regular. Felicidades, tu paciente esta en su peso ideal.",
    color: "bg-green-500",
  },
  {
    score: 6,
    nombre: "Sobrepeso",
    descripcion: "Ligeramente por encima del peso ideal.",
    caracteristicas: [
      "Costillas palpables con ligero exceso de grasa",
      "Cintura visible pero no prominente",
      "Pliegue abdominal presente pero reducido",
      "Depositos de grasa leves",
    ],
    grasaPerro: "25-30%",
    grasaGato: "25-30%",
    recomendacion: "Reducir racion 10-15%. Aumentar ejercicio gradualmente. Evitar premios extras. Reevaluar en 4-6 semanas.",
    color: "bg-yellow-500",
  },
  {
    score: 7,
    nombre: "Obeso leve",
    descripcion: "Sobrepeso evidente que afecta la salud.",
    caracteristicas: [
      "Costillas dificiles de palpar bajo la grasa",
      "Depositos de grasa en region lumbar y base de cola",
      "Cintura ausente o apenas distinguible",
      "Abdomen redondeado",
    ],
    grasaPerro: "30-35%",
    grasaGato: "30-35%",
    recomendacion: "Programa de perdida de peso: reducir calorias 20-25%. Dieta especifica para control de peso. Ejercicio controlado. Control cada 2 semanas.",
    color: "bg-orange-500",
  },
  {
    score: 8,
    nombre: "Obeso",
    descripcion: "Obesidad marcada. Riesgo significativo para la salud.",
    caracteristicas: [
      "Costillas no palpables bajo gruesa capa de grasa",
      "Depositos de grasa evidentes en cuello, extremidades y lomo",
      "Sin cintura visible",
      "Distension abdominal evidente",
    ],
    grasaPerro: "35-45%",
    grasaGato: "35-40%",
    recomendacion: "Plan de adelgazamiento estricto bajo supervision veterinaria. Reducir calorias 25-30%. Dieta terapeutica. Ejercicio suave y controlado. Controles cada 2 semanas.",
    color: "bg-red-400",
  },
  {
    score: 9,
    nombre: "Obeso morbido",
    descripcion: "Obesidad severa. Riesgo vital. Requiere atencion inmediata.",
    caracteristicas: [
      "Depositos masivos de grasa en todo el cuerpo",
      "Costillas totalmente impalpables",
      "Grasa abundante en cuello, extremidades y abdomen",
      "Dificultad para moverse y respirar",
    ],
    grasaPerro: "> 45%",
    grasaGato: "> 40%",
    recomendacion: "Atencion veterinaria inmediata. Plan de perdida de peso supervisado. Evaluacion de comorbilidades (diabetes, artritis, hepatopatia). Dieta terapeutica estricta. Ejercicio muy gradual.",
    color: "bg-red-600",
  },
];

export default function CondicionCorporalPage() {
  const [scoreSeleccionado, setScoreSeleccionado] = useState<number | null>(null);
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");

  const info = scoreSeleccionado !== null ? scores[scoreSeleccionado - 1] : null;

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Volver al inicio
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            Score de Condicion Corporal (BCS)
          </h1>
          <p className="mb-6 text-muted">
            Evalua la condicion corporal de tu paciente usando la escala de 9 puntos. Selecciona el score que mejor describe al animal.
          </p>

          <div className="mb-5">
            <label className="mb-1 block text-sm font-semibold text-foreground">Especie</label>
            <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>

          {/* Score selector */}
          <div className="mb-2">
            <label className="mb-2 block text-sm font-semibold text-foreground">Selecciona el score (1-9)</label>
            <div className="grid grid-cols-9 gap-1.5">
              {scores.map((s) => (
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
                  <span className="hidden text-[10px] leading-tight text-muted sm:block">{s.nombre.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>Emaciado</span>
              <span>Ideal</span>
              <span>Obeso</span>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover">
              Limpiar
            </button>
          </div>

          {/* Resultado detallado */}
          {info && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-6 w-6 rounded-full ${info.color}`} />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      BCS {info.score}/9 - {info.nombre}
                    </h2>
                    <p className="text-sm text-muted">{info.descripcion}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-surface p-4 mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Caracteristicas a evaluar:</h3>
                  <ul className="space-y-1.5">
                    {info.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-surface p-4 mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Porcentaje de grasa corporal estimado</h3>
                  <p className="text-2xl font-bold text-primary">
                    {especie === "perro" ? info.grasaPerro : info.grasaGato}
                  </p>
                </div>

                <div className="rounded-lg bg-surface p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Recomendacion nutricional</h3>
                  <p className="text-sm text-muted">{info.recomendacion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
