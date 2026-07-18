"use client";

import Link from "next/link";
import { calculators, categories, getCalculatorsByCategory } from "@/lib/calculators";
import type { CategoryInfo } from "@/lib/calculators";
import CalcIcon from "@/components/CalcIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryAccents: Record<string, { dot: string; label: string; iconBg: string; iconColor: string; cardHover: string }> = {
  Emergencias:  { dot: "bg-rose-500",    label: "text-rose-700 dark:text-rose-400",    iconBg: "bg-rose-100 dark:bg-rose-900/30",    iconColor: "text-rose-600 dark:text-rose-400",    cardHover: "hover:border-rose-300/60" },
  Farmacologia: { dot: "bg-sky-500",     label: "text-sky-700 dark:text-sky-400",      iconBg: "bg-sky-100 dark:bg-sky-900/30",      iconColor: "text-sky-600 dark:text-sky-400",      cardHover: "hover:border-sky-300/60" },
  Nutricion:    { dot: "bg-emerald-500", label: "text-emerald-700 dark:text-emerald-400", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", cardHover: "hover:border-emerald-300/60" },
  General:      { dot: "bg-violet-500",  label: "text-violet-700 dark:text-violet-400",iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600 dark:text-violet-400", cardHover: "hover:border-violet-300/60" },
};

function CategorySection({ category }: { category: CategoryInfo }) {
  const { t } = useLanguage();
  const items = getCalculatorsByCategory(category.name);
  if (items.length === 0) return null;
  const accent = categoryAccents[category.name] ?? categoryAccents.General;
  const catName = t.categories[category.name as keyof typeof t.categories] as string;
  const catDesc = t.categories[`${category.name}Desc` as keyof typeof t.categories] as string;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className={`h-2.5 w-2.5 rounded-full ${accent.dot} flex-shrink-0`} />
        <div className={`flex items-center gap-1.5 ${accent.label}`}>
          <CalcIcon name={category.icon} className="h-4 w-4" strokeWidth={2.5} />
          <span className="text-sm font-bold">{catName}</span>
        </div>
        <span className="text-xs text-muted hidden sm:inline">{catDesc}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((calc) => {
          const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
          return (
            <Link
              key={calc.id}
              href={calc.path}
              className={`group flex items-start gap-3.5 rounded-2xl border border-border bg-surface p-4 transition-all hover:shadow-sm active:scale-[0.98] ${accent.cardHover}`}
            >
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${accent.iconBg}`}>
                <CalcIcon name={calc.icon} className={`h-5 w-5 ${accent.iconColor}`} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {meta?.name ?? calc.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">
                  {meta?.description ?? calc.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function CalculadorasPage() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t.nav.calculators}</h1>
        <p className="mt-1 text-sm text-muted">{calculators.length} {t.home.tools(calculators.length)}</p>
      </div>
      <div className="space-y-10">
        {categories.map((category) => <CategorySection key={category.name} category={category} />)}
      </div>
      <div className="mt-10 border-t border-border pt-5 text-center text-xs text-muted">
        {t.common.localCalc}{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">{t.common.legalNotice}</Link>
      </div>
    </div>
  );
}
