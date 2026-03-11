"use client";

import Link from "next/link";
import {
  Calculator,
  ClipboardList,
  PawPrint,
  CalendarDays,
  Package,
  Receipt,
  Clock,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { categories, getCalculatorsByCategory } from "@/lib/calculators";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;
  const totalCalcs = categories.reduce((acc, cat) => acc + getCalculatorsByCategory(cat.name).length, 0);

  const comingSoonModules = [
    { nameKey: "patientsModuleName" as const, descKey: "patientsModuleDesc" as const, Icon: PawPrint },
    { nameKey: "agendaModuleName" as const, descKey: "agendaModuleDesc" as const, Icon: CalendarDays },
    { nameKey: "inventoryModuleName" as const, descKey: "inventoryModuleDesc" as const, Icon: Package },
    { nameKey: "billingModuleName" as const, descKey: "billingModuleDesc" as const, Icon: Receipt },
  ];


  return (
    <div className="space-y-10">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-2 lg:pt-0">
        <div className="mb-3 flex lg:justify-start justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Stethoscope className="h-3 w-3" strokeWidth={2.5} />
            {h.badge}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-center lg:text-left leading-tight">
          {h.title}{" "}
          <span className="text-primary">{h.titleHighlight}</span>
        </h1>
        <p className="mt-2 text-sm text-muted text-center lg:text-left max-w-xl">
          {h.subtitle}
        </p>
      </section>

      {/* ── Platform Modules ─────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          {h.modulesTitle}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active module: Calculadoras */}
          <Link
            href="/calculadoras"
            className="group flex flex-col rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 transition-all hover:border-primary/60 hover:bg-primary/8 hover:shadow-md active:scale-[0.99]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Calculator className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                {h.available}
              </span>
            </div>
            <p className="text-base font-bold text-foreground leading-snug">{h.calculatorsModuleName}</p>
            <p className="mt-1 text-sm text-muted">{h.calculatorsModuleDesc}</p>
            <p className="mt-1 text-xs text-muted/70">{h.tools(totalCalcs)}</p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
              {h.calculatorsModuleOpen}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </div>
          </Link>

          {/* Active module: Recetas */}
          <Link
            href="/recetas"
            className="group flex flex-col rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 transition-all hover:border-primary/60 hover:bg-primary/8 hover:shadow-md active:scale-[0.99]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <ClipboardList className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                {h.available}
              </span>
            </div>
            <p className="text-base font-bold text-foreground leading-snug">{h.recetasModuleName}</p>
            <p className="mt-1 text-sm text-muted">{h.recetasModuleDesc}</p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
              {h.recetasModuleOpen}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </div>
          </Link>

          {/* Coming soon modules */}
          {comingSoonModules.map(({ nameKey, descKey, Icon }) => (
            <div
              key={nameKey}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 opacity-60"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5">
                  <Icon className="h-5 w-5 text-muted" strokeWidth={1.8} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground/6 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                  <Clock className="h-2.5 w-2.5" strokeWidth={2.5} />
                  {h.comingSoon}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">{h[nameKey]}</p>
              <p className="mt-1 text-xs text-muted">{h[descKey]}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-muted/60">
        <Link href="/disclaimer" className="text-primary hover:underline">{t.common.legalNotice}</Link>
      </p>
    </div>
  );
}
