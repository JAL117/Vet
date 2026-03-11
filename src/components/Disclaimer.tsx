"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Disclaimer({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div
      className={`rounded-2xl border border-amber-400/40 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} />
        <p>
          <strong>{t.disclaimer.alertLabel}</strong>{" "}
          {t.disclaimer.alert}
        </p>
      </div>
    </div>
  );
}
