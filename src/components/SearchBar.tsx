"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { calculators, type Calculator } from "@/lib/calculators";
import { useLanguage } from "@/contexts/LanguageContext";
import CalcIcon from "./CalcIcon";

export default function SearchBar() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Calculator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length === 0) { setResults([]); setIsOpen(false); return; }
    const normalized = value.toLowerCase().trim();
    const filtered = calculators.filter((calc) => {
      const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
      const name = meta?.name ?? calc.name;
      const desc = meta?.description ?? calc.description;
      const cat = t.categories[calc.category as keyof typeof t.categories] as string;
      return (
        name.toLowerCase().includes(normalized) ||
        desc.toLowerCase().includes(normalized) ||
        cat.toLowerCase().includes(normalized)
      );
    });
    setResults(filtered);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={t.search.placeholder}
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-10 pr-4 text-base text-foreground placeholder:text-muted shadow-sm transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(13,148,136,0.12)] focus:ring-0"
          aria-label={t.search.placeholder}
          role="combobox"
          aria-expanded={isOpen}
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul role="listbox" className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/5">
          {results.map((calc) => {
            const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
            const catLabel = t.categories[calc.category as keyof typeof t.categories] as string;
            return (
              <li key={calc.id} role="option">
                <Link
                  href={calc.path}
                  onClick={() => { setIsOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CalcIcon name={calc.icon} className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{meta?.name ?? calc.name}</p>
                    <p className="text-xs text-muted truncate">{catLabel}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-surface p-5 text-center shadow-xl shadow-black/5">
          <Search className="mx-auto mb-2 h-8 w-8 text-muted/40" strokeWidth={1.5} />
          <p className="text-sm text-muted">{t.search.noResults} &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
