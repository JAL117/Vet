"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DisclaimerPage() {
  const { t } = useLanguage();
  const p = t.pages.disclaimerPage;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          {t.common.back}
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {p.title}
        </h1>
        <p className="mb-8 text-muted">
          {p.updated}
        </p>

        <Disclaimer className="mb-10" />

        <div className="space-y-10">
          {/* Proposito */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              {p.section1Title}
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>{p.section1p1}</p>
              <p className="mt-3">
                {p.section1p2}
              </p>
            </div>
          </section>

          {/* Limitaciones */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              {p.section2Title}
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <ul className="list-inside list-disc space-y-2">
                {p.section2items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Responsabilidad Profesional */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              {p.section3Title}
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>{p.section3intro}</p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                {p.section3items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Privacidad de Datos */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              {p.section4Title}
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
                {p.section4badge}
              </div>
              <ul className="list-inside list-disc space-y-2">
                {p.section4items.map((item, i) => (
                  <li key={i}>
                    {i === 0 ? <strong>{item}</strong> : item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              {p.section5Title}
            </h2>
            <div className="rounded-lg border border-border bg-surface p-5 text-base leading-relaxed text-foreground">
              <p>{p.section5p1}</p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  <span className="font-medium text-primary">{p.email}</span>
                </li>
                <li>
                  <span className="font-medium text-primary">{p.repo}</span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-muted">
                {p.section5p2}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted">
          <p>{p.footer}</p>
        </div>
      </div>
    </div>
  );
}
