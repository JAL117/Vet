"use client";

import { useEffect, useRef, useState } from "react";
import { Settings, Sun, Moon, Globe, Check, LogOut, User, Stethoscope } from "lucide-react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

function useTheme() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("pawcure-theme");
    if (stored === "dark") setDark(true);
    else if (stored === "light") setDark(false);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setDark(true);
  }, []);

  const set = (toDark: boolean) => {
    setDark(toDark);
    document.documentElement.classList.toggle("dark", toDark);
    localStorage.setItem("pawcure-theme", toDark ? "dark" : "light");
  };

  return { dark, set, mounted };
}

interface ProfilePanelProps {
  /** En el sidebar desktop el botón se muestra como fila completa */
  sidebar?: boolean;
}

function useVetProfile() {
  const [vetName, setVetNameState] = useState("");
  const [vetLicense, setVetLicenseState] = useState("");
  const [saved, setSaved] = useState(false);

  // On mount: load from localStorage cache first, then sync from Supabase
  useEffect(() => {
    setVetNameState(localStorage.getItem("pawcure-vet-name") ?? "");
    setVetLicenseState(localStorage.getItem("pawcure-vet-license") ?? "");

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("vet_name, vet_license")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (!data) return;
          const name = data.vet_name ?? "";
          const license = data.vet_license ?? "";
          setVetNameState(name);
          setVetLicenseState(license);
          localStorage.setItem("pawcure-vet-name", name);
          localStorage.setItem("pawcure-vet-license", license);
        });
    });
  }, []);

  function setVetName(v: string) {
    setVetNameState(v);
    setSaved(false);
  }
  function setVetLicense(v: string) {
    setVetLicenseState(v);
    setSaved(false);
  }
  async function save() {
    localStorage.setItem("pawcure-vet-name", vetName);
    localStorage.setItem("pawcure-vet-license", vetLicense);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ vet_name: vetName, vet_license: vetLicense })
        .eq("id", user.id);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return { vetName, setVetName, vetLicense, setVetLicense, save, saved };
}

export default function ProfilePanel({ sidebar = false }: ProfilePanelProps) {
  const { lang, setLang, t } = useLanguage();
  const { dark, set: setDark, mounted } = useTheme();
  const { user, signOut } = useAuth();
  const { vetName, setVetName, vetLicense, setVetLicense, save: saveVet, saved: vetSaved } = useVetProfile();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const languages: { code: Lang; flag: string; label: string }[] = [
    { code: "es", flag: "ES", label: t.nav.spanish },
    { code: "en", flag: "EN", label: t.nav.english },
  ];

  const panel = (
    <div
      className={`z-50 w-64 rounded-2xl border border-border bg-surface shadow-xl shadow-black/10 ${
        sidebar
          ? "mt-2"
          : "absolute right-0 top-full mt-2 origin-top-right"
      }`}
    >
      {/* Header — user info */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <User className="h-4 w-4 text-primary" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.user_metadata?.full_name || t.auth.user.account}
          </p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* Professional data */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <Stethoscope className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.nav.professional}</span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={vetName}
              onChange={(e) => setVetName(e.target.value)}
              placeholder={t.nav.vetNamePlaceholder}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <input
              type="text"
              value={vetLicense}
              onChange={(e) => setVetLicense(e.target.value)}
              placeholder={t.nav.vetLicensePlaceholder}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={saveVet}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                vetSaved
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "border-primary/40 bg-primary/8 text-primary hover:bg-primary/15"
              }`}
            >
              {vetSaved ? (
                <><Check className="h-3 w-3" strokeWidth={2.5} />{t.nav.saved}</>
              ) : (
                t.nav.save
              )}
            </button>
          </div>
        </div>

        {/* Language */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <Globe className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.nav.language}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {languages.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                  lang === code
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:bg-surface-hover"
                }`}
              >
                <span className="flex h-5 w-7 items-center justify-center rounded-md bg-foreground/8 text-[10px] font-bold">
                  {flag}
                </span>
                <span className="flex-1 text-left">{label}</span>
                {lang === code && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        {mounted && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 px-1">
              {dark ? <Moon className="h-3.5 w-3.5 text-muted" strokeWidth={2} /> : <Sun className="h-3.5 w-3.5 text-muted" strokeWidth={2} />}
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.nav.appearance}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { isDark: false, Icon: Sun, label: t.nav.light },
                { isDark: true,  Icon: Moon, label: t.nav.dark  },
              ].map(({ isDark, Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setDark(isDark)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                    dark === isDark
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="flex-1 text-left">{label}</span>
                  {dark === isDark && <Check className="h-3 w-3 text-primary flex-shrink-0" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="border-t border-border px-3 py-2.5">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/8 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          <span>{signingOut ? t.auth.user.signingOut : t.auth.user.signOut}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2 text-center">
        <p className="text-[10px] text-muted/60">{t.nav.appVersion}</p>
      </div>
    </div>
  );

  /* ── Sidebar variant: full-width button + dropdown below ──────────────── */
  if (sidebar) {
    return (
      <div ref={wrapRef} className="w-full">
        <button
          data-profile-trigger
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
            open
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:bg-surface-hover"
          }`}
        >
          <Settings className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
          <span className="flex-1 text-left">{t.nav.settings}</span>
          <span className="rounded-md bg-foreground/8 px-1.5 py-0.5 text-[10px] font-bold text-muted">
            {lang.toUpperCase()}
          </span>
        </button>
        {open && panel}
      </div>
    );
  }

  /* ── Mobile header variant: icon button + dropdown ────────────────────── */
  return (
    <div ref={wrapRef} className="relative">
      <button
        data-profile-trigger
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
          open
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-foreground"
        }`}
        aria-label={t.nav.settings}
      >
        <Settings className="h-4 w-4" strokeWidth={2} />
      </button>
      {open && panel}
    </div>
  );
}
