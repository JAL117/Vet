"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  Droplets,
  FlaskConical,
  Dog,
  Cat,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableData {
  rows: string[][];
}

interface SectionConfig {
  id: string;
  sectionKey: "vitals" | "hematology" | "biochemistry" | "dogWeights" | "catWeights";
  Icon: LucideIcon;
  headerType: "paramDogCat" | "breedWeightSize";
  data: TableData;
}

const sectionsConfig: SectionConfig[] = [
  {
    id: "signos-vitales",
    sectionKey: "vitals",
    Icon: Activity,
    headerType: "paramDogCat",
    data: {
      rows: [
        ["Frecuencia cardiaca / Heart Rate", "60 – 140 lpm", "140 – 220 lpm"],
        ["Frecuencia respiratoria / Respiratory Rate", "10 – 30 rpm", "20 – 42 rpm"],
        ["Temperatura rectal / Rectal Temperature", "38.0 – 39.2 °C", "38.1 – 39.2 °C"],
        ["TRC / CRT", "1 – 2 s", "1 – 2 s"],
        ["Mucosas / Mucous Membranes", "Rosas, húmedas / Pink, moist", "Rosas, húmedas / Pink, moist"],
      ],
    },
  },
  {
    id: "hematologia",
    sectionKey: "hematology",
    Icon: Droplets,
    headerType: "paramDogCat",
    data: {
      rows: [
        ["Hematocrito / Hematocrit", "37 – 55 %", "30 – 45 %"],
        ["Hemoglobina / Hemoglobin", "12 – 18 g/dL", "8 – 15 g/dL"],
        ["Leucocitos / Leukocytes", "6,000 – 17,000 /µL", "5,500 – 19,500 /µL"],
        ["Plaquetas / Platelets", "175,000 – 500,000 /µL", "175,000 – 500,000 /µL"],
      ],
    },
  },
  {
    id: "bioquimica",
    sectionKey: "biochemistry",
    Icon: FlaskConical,
    headerType: "paramDogCat",
    data: {
      rows: [
        ["Glucosa / Glucose", "74 – 143 mg/dL", "74 – 159 mg/dL"],
        ["BUN", "7 – 27 mg/dL", "16 – 36 mg/dL"],
        ["Creatinina / Creatinine", "0.5 – 1.8 mg/dL", "0.8 – 2.4 mg/dL"],
        ["ALT", "10 – 125 U/L", "12 – 130 U/L"],
        ["Albúmina / Albumin", "2.3 – 4.0 g/dL", "2.1 – 3.3 g/dL"],
      ],
    },
  },
  {
    id: "pesos-perros",
    sectionKey: "dogWeights",
    Icon: Dog,
    headerType: "breedWeightSize",
    data: {
      rows: [
        ["Chihuahua", "1.5 – 3.0", "Miniatura / Toy"],
        ["Yorkshire Terrier", "2.0 – 3.5", "Miniatura / Toy"],
        ["Poodle (Miniatura / Miniature)", "4.0 – 6.0", "Pequeño / Small"],
        ["Beagle", "9.0 – 11.0", "Mediano / Medium"],
        ["Bulldog Francés / French Bulldog", "8.0 – 14.0", "Mediano / Medium"],
        ["Cocker Spaniel", "12.0 – 15.0", "Mediano / Medium"],
        ["Labrador Retriever", "25.0 – 36.0", "Grande / Large"],
        ["Golden Retriever", "25.0 – 34.0", "Grande / Large"],
        ["Pastor Alemán / German Shepherd", "30.0 – 40.0", "Grande / Large"],
        ["Gran Danés / Great Dane", "50.0 – 80.0", "Gigante / Giant"],
      ],
    },
  },
  {
    id: "pesos-gatos",
    sectionKey: "catWeights",
    Icon: Cat,
    headerType: "breedWeightSize",
    data: {
      rows: [
        ["Singapura", "2.0 – 3.5", "Pequeño / Small"],
        ["Siamés / Siamese", "3.0 – 5.0", "Mediano / Medium"],
        ["Doméstico Común / Domestic Shorthair", "3.5 – 5.5", "Mediano / Medium"],
        ["Abisinio / Abyssinian", "3.0 – 5.0", "Mediano / Medium"],
        ["Persa / Persian", "3.5 – 7.0", "Mediano / Medium"],
        ["Bengal", "4.0 – 7.0", "Mediano / Medium"],
        ["Azul Ruso / Russian Blue", "3.5 – 6.5", "Mediano / Medium"],
        ["Británico de Pelo Corto / British Shorthair", "4.0 – 8.0", "Mediano-Grande / Medium-Large"],
        ["Ragdoll", "4.5 – 9.0", "Grande / Large"],
        ["Maine Coon", "5.5 – 11.0", "Grande / Large"],
      ],
    },
  },
];

function ReferenceTable({
  section,
  title,
  headers,
  searchQuery,
}: {
  section: SectionConfig;
  title: string;
  headers: string[];
  searchQuery: string;
}) {
  const filteredRows = searchQuery
    ? section.data.rows.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : section.data.rows;

  if (searchQuery && filteredRows.length === 0) return null;

  return (
    <section id={section.id}>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <section.Icon className="h-4 w-4 text-primary" strokeWidth={2} />
        </div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-dark dark:text-primary-light"
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
                      cellIndex === 0 ? "font-medium text-foreground" : "text-muted"
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
  const { t } = useLanguage();
  const pr = t.pages.referencia;

  const [search, setSearch] = useState("");

  function getSectionTitle(s: SectionConfig): string {
    return pr.sections[s.sectionKey];
  }

  function getSectionHeaders(s: SectionConfig): string[] {
    if (s.headerType === "breedWeightSize") {
      return [pr.headers.breed, pr.headers.weight, pr.headers.size];
    }
    return [pr.headers.parameter, pr.headers.dog, pr.headers.cat];
  }

  const visibleSections = search
    ? sectionsConfig.filter((section) =>
        section.data.rows.some((row) =>
          row.some((cell) => cell.toLowerCase().includes(search.toLowerCase()))
        )
      )
    : sectionsConfig;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {pr.title}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pr.subtitle}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder={pr.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:text-foreground transition-colors"
            aria-label={pr.clearSearch}
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Quick nav */}
      {!search && (
        <nav className="mb-8 flex flex-wrap gap-2">
          {sectionsConfig.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <section.Icon className="h-3 w-3" strokeWidth={2} />
              {getSectionTitle(section)}
            </a>
          ))}
        </nav>
      )}

      {/* Tables */}
      <div className="space-y-8">
        {visibleSections.length > 0 ? (
          visibleSections.map((section) => (
            <ReferenceTable
              key={section.id}
              section={section}
              title={getSectionTitle(section)}
              headers={getSectionHeaders(section)}
              searchQuery={search}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted/30" strokeWidth={1.5} />
            <p className="text-sm text-muted">
              {pr.noResults} &quot;{search}&quot;
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              {pr.clearSearch}
            </button>
          </div>
        )}
      </div>

      <Disclaimer className="mt-8" />

      <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted">
        {pr.basedOn}{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          {t.common.legalNotice}
        </Link>
      </div>
    </div>
  );
}
