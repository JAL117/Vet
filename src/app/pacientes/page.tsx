"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PawPrint, Plus, Search, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Patient, formatAge } from "@/types/patient";
import { useLanguage } from "@/contexts/LanguageContext";

type Filter = "all" | "perro" | "gato" | "otro";

const SPECIES_EMOJI: Record<string, string> = {
  perro: "🐶",
  gato: "🐱",
  otro: "🐾",
};

export default function PacientesPage() {
  const { t } = useLanguage();
  const p = t.pages.pacientes;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        setError(p.errorLoad);
      } else {
        setPatients(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter((pt) => {
      if (filter !== "all" && pt.species !== filter) return false;
      if (!q) return true;
      return (
        pt.name.toLowerCase().includes(q) ||
        pt.owner_name.toLowerCase().includes(q)
      );
    });
  }, [patients, search, filter]);

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: p.filterAll },
    { key: "perro", label: p.filterDog },
    { key: "gato", label: p.filterCat },
    { key: "otro", label: p.filterOther },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <PawPrint className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{p.title}</h1>
            <p className="text-sm text-muted">{p.subtitle}</p>
          </div>
        </div>
        <Link
          href="/pacientes/nuevo"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 flex-shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">{p.newPatient}</span>
        </Link>
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={p.searchPlaceholder}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                filter === key
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 px-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-3xl">
            🐾
          </div>
          <h3 className="text-base font-semibold text-foreground">{p.empty}</h3>
          <p className="mt-1 text-sm text-muted">{p.emptySubtitle}</p>
          <Link
            href="/pacientes/nuevo"
            className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {p.addFirst}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-12 px-8 text-center">
          <Search className="mb-3 h-8 w-8 text-muted/40" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-foreground">{p.noResults}</h3>
          <p className="mt-1 text-sm text-muted">{p.noResultsSubtitle}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">{p.patientsCount(filtered.length)}</p>
          <ul className="space-y-2">
            {filtered.map((pt) => (
              <li key={pt.id}>
                <Link
                  href={`/pacientes/${pt.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8 text-xl">
                    {SPECIES_EMOJI[pt.species] ?? "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{pt.name}</p>
                    <p className="text-xs text-muted truncate">
                      {pt.breed ? `${pt.breed} · ` : ""}{pt.owner_name}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                    {pt.weight_kg && (
                      <span className="text-xs text-muted">{pt.weight_kg} kg</span>
                    )}
                    {pt.birth_date && (
                      <span className="text-xs text-muted">{formatAge(pt.birth_date)}</span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted/40 flex-shrink-0" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
