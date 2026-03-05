"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  categories,
  getCalculatorsByCategory,
  type CalculatorCategory,
} from "@/lib/calculators";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<CalculatorCategory>
  >(new Set(["Emergencias", "Farmacologia", "Nutricion", "General"]));
  const pathname = usePathname();

  const toggleCategory = (category: CalculatorCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const isActive = (path: string) => pathname === path;

  const navContent = (
    <nav className="flex h-full flex-col" aria-label="Navegacion principal">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-white font-bold">
            V
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              VetCalc
            </h1>
            <p className="text-xs text-muted">Calculadora Veterinaria</p>
          </div>
        </Link>
      </div>

      {/* Main links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/documentos"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive("/documentos")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              Generar Documento
            </Link>
          </li>
          <li>
            <Link
              href="/referencia"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive("/referencia")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Guia Rapida
            </Link>
          </li>
        </ul>

        {/* Separator */}
        <div className="my-4 border-t border-border" />

        {/* Calculator categories */}
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Calculadoras
        </p>
        <ul className="space-y-1">
          {categories.map((category) => {
            const calcs = getCalculatorsByCategory(category.name);
            const isExpanded = expandedCategories.has(category.name);
            return (
              <li key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                  aria-expanded={isExpanded}
                >
                  <span className="text-lg" aria-hidden="true">
                    {category.icon}
                  </span>
                  <span className="flex-1 text-left">{category.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 text-muted transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
                {isExpanded && (
                  <ul className="ml-4 space-y-0.5 border-l border-border pl-4">
                    {calcs.map((calc) => (
                      <li key={calc.id}>
                        <Link
                          href={calc.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive(calc.path)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted hover:text-foreground hover:bg-surface-hover"
                          }`}
                        >
                          <span className="text-base" aria-hidden="true">
                            {calc.icon}
                          </span>
                          {calc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer with theme toggle */}
      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-muted">Tema</span>
        <ThemeToggle />
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile header bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-hover"
          aria-label="Abrir menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white font-bold">
            V
          </div>
          <span className="text-base font-bold text-foreground">VetCalc</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - mobile slide-in */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transform border-r border-border bg-surface transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu lateral"
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Cerrar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {navContent}
      </aside>

      {/* Sidebar - desktop always visible */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-surface"
        aria-label="Menu lateral"
      >
        {navContent}
      </aside>
    </>
  );
}
