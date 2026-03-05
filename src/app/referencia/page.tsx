"use client";

import Link from "next/link";
import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ReferenceSection {
  id: string;
  title: string;
  icon: string;
  data: TableData;
}

const sections: ReferenceSection[] = [
  {
    id: "signos-vitales",
    title: "Signos Vitales Normales",
    icon: "\u2764\uFE0F",
    data: {
      headers: ["Parametro", "Perro", "Gato"],
      rows: [
        ["Frecuencia cardiaca", "60 - 140 lpm", "140 - 220 lpm"],
        ["Frecuencia respiratoria", "10 - 30 rpm", "20 - 42 rpm"],
        ["Temperatura rectal", "38.0 - 39.2 \u00B0C", "38.1 - 39.2 \u00B0C"],
        [
          "TRC (Tiempo de Relleno Capilar)",
          "1 - 2 segundos",
          "1 - 2 segundos",
        ],
        ["Mucosas", "Rosas, humedas", "Rosas, humedas"],
      ],
    },
  },
  {
    id: "hematologia",
    title: "Valores Hematologicos",
    icon: "\u{1FA78}",
    data: {
      headers: ["Parametro", "Perro", "Gato"],
      rows: [
        ["Hematocrito", "37 - 55 %", "30 - 45 %"],
        ["Hemoglobina", "12 - 18 g/dL", "8 - 15 g/dL"],
        ["Leucocitos", "6,000 - 17,000 /\u00B5L", "5,500 - 19,500 /\u00B5L"],
        [
          "Plaquetas",
          "175,000 - 500,000 /\u00B5L",
          "175,000 - 500,000 /\u00B5L",
        ],
      ],
    },
  },
  {
    id: "bioquimica",
    title: "Bioquimica Sanguinea",
    icon: "\u{1F9EA}",
    data: {
      headers: ["Parametro", "Perro", "Gato"],
      rows: [
        ["Glucosa", "74 - 143 mg/dL", "74 - 159 mg/dL"],
        ["BUN", "7 - 27 mg/dL", "16 - 36 mg/dL"],
        ["Creatinina", "0.5 - 1.8 mg/dL", "0.8 - 2.4 mg/dL"],
        ["ALT", "10 - 125 U/L", "12 - 130 U/L"],
        ["Albumina", "2.3 - 4.0 g/dL", "2.1 - 3.3 g/dL"],
      ],
    },
  },
  {
    id: "pesos-perros",
    title: "Pesos Promedio - Razas de Perros",
    icon: "\u{1F415}",
    data: {
      headers: ["Raza", "Peso Adulto Promedio (kg)", "Tamano"],
      rows: [
        ["Chihuahua", "1.5 - 3.0", "Miniatura"],
        ["Yorkshire Terrier", "2.0 - 3.5", "Miniatura"],
        ["Poodle (Miniatura)", "4.0 - 6.0", "Pequeno"],
        ["Beagle", "9.0 - 11.0", "Mediano"],
        ["Bulldog Frances", "8.0 - 14.0", "Mediano"],
        ["Cocker Spaniel", "12.0 - 15.0", "Mediano"],
        ["Labrador Retriever", "25.0 - 36.0", "Grande"],
        ["Golden Retriever", "25.0 - 34.0", "Grande"],
        ["Pastor Aleman", "30.0 - 40.0", "Grande"],
        ["Gran Danes", "50.0 - 80.0", "Gigante"],
      ],
    },
  },
  {
    id: "pesos-gatos",
    title: "Pesos Promedio - Razas de Gatos",
    icon: "\u{1F408}",
    data: {
      headers: ["Raza", "Peso Adulto Promedio (kg)", "Tamano"],
      rows: [
        ["Singapura", "2.0 - 3.5", "Pequeno"],
        ["Siames", "3.0 - 5.0", "Mediano"],
        ["Domestico Comun", "3.5 - 5.5", "Mediano"],
        ["Abisinio", "3.0 - 5.0", "Mediano"],
        ["Persa", "3.5 - 7.0", "Mediano"],
        ["Bengal", "4.0 - 7.0", "Mediano"],
        ["Azul Ruso", "3.5 - 6.5", "Mediano"],
        ["Britanico de Pelo Corto", "4.0 - 8.0", "Mediano-Grande"],
        ["Ragdoll", "4.5 - 9.0", "Grande"],
        ["Maine Coon", "5.5 - 11.0", "Grande"],
      ],
    },
  },
];

function ReferenceTable({
  section,
  searchQuery,
}: {
  section: ReferenceSection;
  searchQuery: string;
}) {
  const filteredRows = searchQuery
    ? section.data.rows.filter((row) =>
        row.some((cell) =>
          cell.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : section.data.rows;

  if (searchQuery && filteredRows.length === 0) return null;

  return (
    <section id={section.id}>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-foreground">
        <span className="text-2xl">{section.icon}</span>
        {section.title}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-base">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {section.data.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-dark dark:text-primary-light"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-border last:border-b-0 transition-colors hover:bg-surface-hover ${
                  rowIndex % 2 === 0 ? "bg-surface" : "bg-background"
                }`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 ${
                      cellIndex === 0
                        ? "font-medium text-foreground"
                        : "text-muted"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ReferenciaPage() {
  const [search, setSearch] = useState("");

  const visibleSections = search
    ? sections.filter((section) =>
        section.data.rows.some((row) =>
          row.some((cell) =>
            cell.toLowerCase().includes(search.toLowerCase())
          )
        )
      )
    : sections;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Guia Rapida de Referencia
          </h1>
          <p className="text-lg text-muted">
            Valores normales y rangos de referencia para la practica veterinaria
            en perros y gatos.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar parametro, raza, valor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-foreground"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Quick nav */}
        {!search && (
          <nav className="mb-10 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                {section.icon} {section.title}
              </a>
            ))}
          </nav>
        )}

        {/* Tables */}
        <div className="space-y-10">
          {visibleSections.length > 0 ? (
            visibleSections.map((section) => (
              <ReferenceTable
                key={section.id}
                section={section}
                searchQuery={search}
              />
            ))
          ) : (
            <div className="rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-lg text-muted">
                No se encontraron resultados para &quot;{search}&quot;
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Limpiar busqueda
              </button>
            </div>
          )}
        </div>

        <Disclaimer className="mt-10" />

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
          <p>
            Valores de referencia basados en literatura veterinaria
            generalmente aceptada.{" "}
            <Link href="/disclaimer" className="text-primary hover:underline">
              Ver aviso legal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
