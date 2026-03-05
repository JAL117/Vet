"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { calculators, type Calculator } from "@/lib/calculators";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Calculator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const normalized = value.toLowerCase().trim();
    const filtered = calculators.filter(
      (calc) =>
        calc.name.toLowerCase().includes(normalized) ||
        calc.description.toLowerCase().includes(normalized) ||
        calc.category.toLowerCase().includes(normalized)
    );
    setResults(filtered);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Buscar calculadora..."
          className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-lg text-foreground placeholder:text-muted shadow-sm transition-all focus:border-primary focus:shadow-md focus:ring-0"
          aria-label="Buscar calculadoras"
          aria-expanded={isOpen}
          role="combobox"
          aria-controls="search-results"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
        >
          {results.map((calc) => (
            <li key={calc.id} role="option">
              <Link
                href={calc.path}
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
              >
                <span className="text-2xl" aria-hidden="true">
                  {calc.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {calc.name}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {calc.category} &mdash; {calc.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface p-4 text-center text-muted shadow-lg">
          No se encontraron calculadoras para &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
