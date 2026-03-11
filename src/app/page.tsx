"use client";

import Link from "next/link";
import {
  Calculator,
  PawPrint,
  CalendarDays,
  Package,
  Receipt,
  Clock,
  ChevronRight,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CalcIcon from "@/components/CalcIcon";
import { categories, getCalculatorsByCategory } from "@/lib/calculators";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryStyles: Record<string, { bg: string; border: string; iconBg: string; iconColor: string }> = {
  Emergencias: { bg: "bg-rose-50 dark:bg-rose-950/20", border: "border-rose-200/70 dark:border-rose-800/30", iconBg: "bg-rose-100 dark:bg-rose-900/40", iconColor: "text-rose-600 dark:text-rose-400" },
  Farmacologia: { bg: "bg-sky-50 dark:bg-sky-950/20", border: "border-sky-200/70 dark:border-sky-800/30", iconBg: "bg-sky-100 dark:bg-sky-900/40", iconColor: "text-sky-600 dark:text-sky-400" },
  Nutricion: { bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200/70 dark:border-emerald-800/30", iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconColor: "text-emerald-600 dark:text-emerald-400" },
  General: { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200/70 dark:border-violet-800/30", iconBg: "bg-violet-100 dark:bg-violet-900/40", iconColor: "text-violet-600 dark:text-violet-400" },
};

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
            className="group relative col-span-full sm:col-span-2 lg:col-span-1 flex flex-col rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 transition-all hover:border-primary/60 hover:bg-primary/8 hover:shadow-md active:scale-[0.99]"
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

      {/* ── Calculators quick access ─────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          {h.calculatorsSectionTitle}
        </h2>
        <div className="mb-4"><SearchBar /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const calcs = getCalculatorsByCategory(category.name);
            const style = categoryStyles[category.name] ?? categoryStyles.General;
            const catName = t.categories[category.name as keyof typeof t.categories] as string;
            return (
              <div key={category.name} className={`rounded-2xl border p-5 ${style.bg} ${style.border}`}>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.iconBg}`}>
                    <CalcIcon name={category.icon} className={`h-3.5 w-3.5 ${style.iconColor}`} strokeWidth={2.5} />
                  </div>
                  <span className={`text-sm font-bold ${style.iconColor}`}>{catName}</span>
                  <span className="ml-auto text-xs text-muted">{h.tools(calcs.length)}</span>
                </div>
                <ul className="space-y-0.5">
                  {calcs.map((calc) => {
                    const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
                    return (
                      <li key={calc.id}>
                        <Link
                          href={calc.path}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/60 dark:hover:bg-white/6 active:scale-[0.98]"
                        >
                          <CalcIcon name={calc.icon} className={`h-4 w-4 flex-shrink-0 ${style.iconColor} opacity-80`} strokeWidth={2} />
                          <span className="flex-1 text-sm font-medium text-foreground leading-snug">{meta?.name ?? calc.name}</span>
                          <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ${style.iconColor}`} strokeWidth={2.5} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-muted/60">
        <Link href="/disclaimer" className="text-primary hover:underline">{t.common.legalNotice}</Link>
      </p>
    </div>
  );
}
