"use client";

import { useState } from "react";
import Link from "next/link";

type Tamano = "pequeno" | "mediano" | "grande" | "gigante";

export default function EdadEquivalentePage() {
  const [especie, setEspecie] = useState<"perro" | "gato">("perro");
  const [tamano, setTamano] = useState<Tamano>("mediano");
  const [edad, setEdad] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const e: Record<string, string> = {};
    const ed = parseFloat(edad);

    if (!edad || isNaN(ed) || ed <= 0) e.edad = "Ingrese una edad valida mayor a 0";
    if (ed > 30) e.edad = "La edad parece demasiado alta (max 30 anos)";

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
      // Para cachorros menores de 1 ano, interpolar linealmente
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
    if (edadHumana < 15) return "Cachorro / Gatito";
    if (edadHumana < 25) return "Adolescente";
    if (edadHumana < 40) return "Adulto joven";
    if (edadHumana < 55) return "Adulto";
    if (edadHumana < 70) return "Adulto mayor";
    if (edadHumana < 85) return "Senior";
    return "Geriatrico";
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
            Edad Humana Equivalente
          </h1>
          <p className="mb-6 text-muted">
            Estima la edad equivalente en anos humanos segun la especie, tamano y edad del paciente.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Especie</label>
              <select value={especie} onChange={(e) => { setEspecie(e.target.value as "perro" | "gato"); setResultado(null); }}>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            {especie === "perro" && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">Tamano</label>
                <select value={tamano} onChange={(e) => { setTamano(e.target.value as Tamano); setResultado(null); }}>
                  <option value="pequeno">Pequeno (&lt; 10 kg)</option>
                  <option value="mediano">Mediano (10 - 25 kg)</option>
                  <option value="grande">Grande (25 - 45 kg)</option>
                  <option value="gigante">Gigante (&gt; 45 kg)</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Edad</label>
              <div className="relative">
                <input type="number" placeholder="Ej: 5" value={edad} onChange={(e) => setEdad(e.target.value)} min="0" max="30" step="0.5" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">anos</span>
              </div>
              {errores.edad && <p className="mt-1 text-sm text-danger">{errores.edad}</p>}
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
              <p className="text-4xl font-bold text-primary">
                ~{Math.round(resultado)} <span className="text-lg font-medium">anos humanos</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                Un {especie} de {edad} ano{parseFloat(edad) !== 1 ? "s" : ""}{especie === "perro" ? ` (${tamano})` : ""} equivale aproximadamente a {Math.round(resultado)} anos humanos.
              </p>
              <div className="mt-3 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
                Etapa de vida: {getEtapaVida(resultado)}
              </div>
            </div>
          )}

          {/* Tabla de referencia rapida */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Esperanza de vida promedio
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span className="text-muted">Perro pequeno</span>
                <span className="font-semibold text-foreground">12-16 anos</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span className="text-muted">Perro mediano</span>
                <span className="font-semibold text-foreground">10-14 anos</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span className="text-muted">Perro grande</span>
                <span className="font-semibold text-foreground">8-12 anos</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span className="text-muted">Perro gigante</span>
                <span className="font-semibold text-foreground">6-10 anos</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span className="text-muted">Gato</span>
                <span className="font-semibold text-foreground">12-18 anos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
