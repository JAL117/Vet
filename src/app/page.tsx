"use client";

import Link from "next/link";
import { FileText, BookOpen, AlertCircle, ChevronRight, Stethoscope } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="pt-2 lg:pt-0">
        <div className="mb-3 flex lg:justify-start justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Stethoscope className="h-3 w-3" strokeWidth={2.5} />
            {t.home.badge}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-center lg:text-left leading-tight">
          {t.home.title}{" "}
          <span className="text-primary">{t.home.titleHighlight}</span>
        </h1>
        <p className="mt-2 text-sm text-muted text-center lg:text-left max-w-xl">
          {t.home.subtitle}
        </p>
      </section>

      {/* Search */}
      <section><SearchBar /></section>

      {/* Categories */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.home.categoriesTitle}
        </h2>
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
                  <span className="ml-auto text-xs text-muted">{t.home.tools(calcs.length)}</span>
                </div>
                <ul className="space-y-0.5">
                  {calcs.map((calc) => {
                    const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
                    return (
                      <li key={calc.id}>
                        <Link href={calc.path} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/60 dark:hover:bg-white/6 active:scale-[0.98]">
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

      {/* Quick access */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.home.quickAccessTitle}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/documentos" className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.98]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.home.generateDocument}</p>
              <p className="text-xs text-muted">{t.home.generateDocumentSub}</p>
            </div>
          </Link>
          <Link href="/referencia" className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.98]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.home.quickGuide}</p>
              <p className="text-xs text-muted">{t.home.quickGuideSub}</p>
            </div>
          </Link>
          <Link href="/calculadoras/fluidoterapia" className="flex items-center gap-3.5 rounded-2xl border border-rose-200/60 bg-rose-50/60 dark:border-rose-800/25 dark:bg-rose-950/15 p-4 transition-all hover:border-rose-300 hover:shadow-sm active:scale-[0.98]">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">{t.home.emergencies}</p>
              <p className="text-xs text-muted">{t.home.emergenciesSub}</p>
            </div>
          </Link>
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-muted/60">
        {t.common.localCalc}{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">{t.common.legalNotice}</Link>
      </p>
    </div>
  );
}
