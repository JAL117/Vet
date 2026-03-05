"use client";

import { useState } from "react";
import Link from "next/link";

export default function TransfusionPage() {
  const [peso, setPeso] = useState("");
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [htoReceptor, setHtoReceptor] = useState("");
  const [htoDeseado, setHtoDeseado] = useState("");
  const [htoDonante, setHtoDonante] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const p = parseFloat(peso);
    const hr = parseFloat(htoReceptor);
    const hd = parseFloat(htoDeseado);
    const hdon = parseFloat(htoDonante);

    if (!peso || isNaN(p) || p <= 0) e.peso = "Ingrese un peso valido mayor a 0";
    if (p > 1000) e.peso = "El peso parece demasiado alto (max 1000 kg)";
    if (!htoReceptor || isNaN(hr) || hr < 0 || hr > 100) e.htoReceptor = "Ingrese un hematocrito valido (0-100%)";
    if (!htoDeseado || isNaN(hd) || hd < 0 || hd > 100) e.htoDeseado = "Ingrese un hematocrito valido (0-100%)";
    if (!htoDonante || isNaN(hdon) || hdon <= 0 || hdon > 100) e.htoDonante = "Ingrese un hematocrito valido (1-100%)";
    if (!e.htoReceptor && !e.htoDeseado && hd <= hr) e.htoDeseado = "El hematocrito deseado debe ser mayor al del receptor";

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function calcular() {
    if (!validar()) return;
    const p = parseFloat(peso);
    const hr = parseFloat(htoReceptor);
    const hd = parseFloat(htoDeseado);
    const hdon = parseFloat(htoDonante);
    const factorVolemia = especie === "perro" ? 90 : 70;

    const volumen = (p * factorVolemia * (hd - hr)) / hdon;
    setResultado(volumen);
  }

  function limpiar() {
    setPeso("");
    setEspecie("perro");
    setHtoReceptor("");
    setHtoDeseado("");
    setHtoDonante("");
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Volver al inicio
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            Transfusion Sanguinea
          </h1>
          <p className="mb-6 text-muted">
            Calcula el volumen de sangre entera necesario para una transfusion basado en los hematocritos del receptor y donante.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Peso del paciente</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 10" value={peso} onChange={(e) => setPeso(e.target.value)} min="0" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">kg</span>
              </div>
              {errores.peso && <p className="mt-1 text-sm text-danger">{errores.peso}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Especie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as "perro" | "gato")}>
                <option value="perro">Perro (volemia: 90 ml/kg)</option>
                <option value="gato">Gato (volemia: 70 ml/kg)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Hematocrito del receptor</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 15" value={htoReceptor} onChange={(e) => setHtoReceptor(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errores.htoReceptor && <p className="mt-1 text-sm text-danger">{errores.htoReceptor}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Hematocrito deseado</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 30" value={htoDeseado} onChange={(e) => setHtoDeseado(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errores.htoDeseado && <p className="mt-1 text-sm text-danger">{errores.htoDeseado}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Hematocrito del donante</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 40" value={htoDonante} onChange={(e) => setHtoDonante(e.target.value)} min="0" max="100" step="any" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">%</span>
              </div>
              {errores.htoDonante && <p className="mt-1 text-sm text-danger">{errores.htoDonante}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={calcular} className="flex-1 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark">
              Calcular
            </button>
            <button onClick={limpiar} className="rounded-xl border border-border px-6 py-3 text-base font-semibold text-muted transition-colors hover:bg-surface-hover">
              Limpiar
            </button>
          </div>

          {resultado !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 border border-primary/30 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Resultado
              </h2>
              <p className="text-3xl font-bold text-primary">
                {resultado.toFixed(1)} <span className="text-lg font-medium">ml</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                Volumen de sangre entera a transfundir
              </p>
              <div className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
                <strong>Formula:</strong> ({peso} kg x {especie === "perro" ? "90" : "70"} ml/kg x ({htoDeseado}% - {htoReceptor}%)) / {htoDonante}% = {resultado.toFixed(1)} ml
              </div>
              <div className="mt-2 rounded-lg bg-warning/10 border border-warning/30 p-3 text-sm text-foreground">
                <strong>Nota:</strong> Administrar a velocidad de 0.25 ml/kg/h durante los primeros 15-30 minutos. Si no hay reacciones adversas, aumentar a 5-10 ml/kg/h.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
