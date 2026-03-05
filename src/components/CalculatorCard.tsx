"use client";

import { type ReactNode } from "react";

interface CalculatorCardProps {
  title: string;
  description?: string;
  icon?: string;
  children: ReactNode;
  result?: ReactNode;
}

export default function CalculatorCard({
  title,
  description,
  icon,
  children,
  result,
}: CalculatorCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <span className="text-3xl" aria-hidden="true">
              {icon}
            </span>
          )}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        {description && (
          <p className="text-base text-muted leading-relaxed">{description}</p>
        )}
      </div>

      {/* Input section */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="space-y-5">{children}</div>
      </div>

      {/* Result section */}
      {result && (
        <div className="mt-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Resultado
          </h3>
          <div className="text-foreground">{result}</div>
        </div>
      )}
    </div>
  );
}

/* Subcomponents for consistent form fields within CalculatorCard */

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-foreground"
      >
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-muted">{hint}</p>}
      {children}
    </div>
  );
}

interface ResultValueProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export function ResultValue({
  label,
  value,
  unit,
  highlight = false,
}: ResultValueProps) {
  return (
    <div
      className={`flex items-baseline justify-between rounded-lg px-4 py-3 ${
        highlight ? "bg-primary/10" : "bg-surface/50"
      }`}
    >
      <span className="text-sm font-medium text-muted">{label}</span>
      <span
        className={`text-xl font-bold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-muted">{unit}</span>
        )}
      </span>
    </div>
  );
}
