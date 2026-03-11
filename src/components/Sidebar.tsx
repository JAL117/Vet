"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Calculator, ClipboardList, BookOpen, ChevronRight,
  PawPrint, CalendarDays, Package, Receipt, Settings,
} from "lucide-react";
import { categories, getCalculatorsByCategory, type CalculatorCategory } from "@/lib/calculators";
import { useLanguage } from "@/contexts/LanguageContext";
import CalcIcon from "./CalcIcon";
import ProfilePanel from "./ProfilePanel";
import { useState } from "react";

/** Routes where the full sidebar is visible. All other routes get the icon rail. */
const FULL_SIDEBAR_ROUTES = ["/", "/referencia"];

export default function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<Set<CalculatorCategory>>(
    new Set(["Emergencias", "Farmacologia", "Nutricion", "General"])
  );
  const pathname = usePathname();
  const { t } = useLanguage();

  const isCollapsed = !FULL_SIDEBAR_ROUTES.includes(pathname);
  const isActive = (path: string) => pathname === path;
  const isMobileNavActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const toggleCategory = (category: CalculatorCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const mobileNavItems = [
    { href: "/",             label: t.nav.home,      Icon: Home,          exact: true  },
    { href: "/calculadoras", label: t.nav.calculate, Icon: Calculator,    exact: false },
    { href: "/recetas",      label: t.nav.recetas,   Icon: ClipboardList, exact: true  },
    { href: "/pacientes",    label: t.nav.patients,  Icon: PawPrint,      exact: false },
    { href: "/referencia",   label: t.nav.guide,     Icon: BookOpen,      exact: true  },
  ];

  const railLinks = [
    { href: "/",             label: t.nav.home,      Icon: Home,          exact: true  },
    { href: "/calculadoras", label: t.nav.calculate, Icon: Calculator,    exact: false },
    { href: "/recetas",      label: t.nav.recetas,   Icon: ClipboardList, exact: true  },
    { href: "/pacientes",    label: t.nav.patients,  Icon: PawPrint,      exact: false },
    { href: "/referencia",   label: t.nav.guide,     Icon: BookOpen,      exact: true  },
  ];

  /* ── Full sidebar content ──────────────────────────────────────────────── */
  const fullSidebar = (
    <nav className="flex h-full flex-col" aria-label="Navegacion principal">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-base text-white font-bold shadow-sm">P</div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">PawCure</p>
            <p className="text-xs text-muted">{t.nav.vetTool}</p>
          </div>
        </Link>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main links */}
        <ul className="space-y-0.5">
          {[
            { href: "/",           label: t.nav.home,       Icon: Home     },
            { href: "/referencia", label: t.nav.quickGuide, Icon: BookOpen },
          ].map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-border" />

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {t.nav.modules}
        </p>

        {/* Module: Calculadoras */}
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/calculadoras"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/calculadoras") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <Calculator className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span className="flex-1">{t.nav.calculators}</span>
              <ChevronRight
                className={`h-3.5 w-3.5 text-muted transition-transform ${pathname.startsWith("/calculadoras") ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </Link>
          </li>
        </ul>

        {/* Calculator subcategories — only when inside /calculadoras */}
        {pathname.startsWith("/calculadoras") && (
          <ul className="ml-4 mt-0.5 mb-1 space-y-0.5 border-l border-border pl-3">
            {categories.map((category) => {
              const calcs = getCalculatorsByCategory(category.name);
              const isExpanded = expandedCategories.has(category.name);
              const catLabel = t.categories[category.name as keyof typeof t.categories] as string;
              return (
                <li key={category.name}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                    aria-expanded={isExpanded}
                  >
                    <CalcIcon name={category.icon} className="h-3.5 w-3.5 flex-shrink-0 text-muted" strokeWidth={2} />
                    <span className="flex-1 text-left">{catLabel}</span>
                    <ChevronRight className={`h-3 w-3 text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`} strokeWidth={2.5} />
                  </button>
                  {isExpanded && (
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                      {calcs.map((calc) => {
                        const meta = t.calculatorMeta[calc.id as keyof typeof t.calculatorMeta];
                        return (
                          <li key={calc.id}>
                            <Link
                              href={calc.path}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                                isActive(calc.path) ? "bg-primary/10 text-primary font-medium" : "text-muted hover:text-foreground hover:bg-surface-hover"
                              }`}
                            >
                              <CalcIcon name={calc.icon} className="h-3 w-3 flex-shrink-0" strokeWidth={2} />
                              {meta?.name ?? calc.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Module: Recetas */}
        <ul className="mt-0.5 space-y-0.5">
          <li>
            <Link
              href="/recetas"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive("/recetas") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <ClipboardList className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span className="flex-1">{t.nav.recetas}</span>
            </Link>
          </li>
        </ul>

        <div className="my-3 border-t border-border" />

        {/* Module: Pacientes */}
        <ul className="mt-0.5 space-y-0.5">
          <li>
            <Link
              href="/pacientes"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/pacientes") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-hover"
              }`}
            >
              <PawPrint className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span className="flex-1">{t.nav.patients}</span>
            </Link>
          </li>
        </ul>

        {/* Coming soon */}
        <ul className="space-y-0.5 mt-0.5">
          {[
            { Icon: CalendarDays, label: t.home.agendaModuleName    },
            { Icon: Package,      label: t.home.inventoryModuleName },
            { Icon: Receipt,      label: t.home.billingModuleName   },
          ].map(({ Icon, label }) => (
            <li key={label}>
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted/50 cursor-default select-none">
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                <span className="text-[9px] font-bold uppercase tracking-wide bg-foreground/6 text-muted/60 px-1.5 py-0.5 rounded-md">
                  {t.home.comingSoon}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <ProfilePanel sidebar />
      </div>
    </nav>
  );

  /* ── Icon rail (collapsed) ─────────────────────────────────────────────── */
  const [profileOpen, setProfileOpen] = useState(false);

  const iconRail = (
    <nav className="flex h-full flex-col items-center py-4 gap-1" aria-label="Navegacion">
      {/* Logo */}
      <Link
        href="/"
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm text-white font-bold shadow-sm"
        title="PawCure"
      >
        P
      </Link>

      {/* Nav icons */}
      <div className="flex flex-1 flex-col items-center gap-1">
        {railLinks.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                active ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
            </Link>
          );
        })}
      </div>

      {/* Settings icon */}
      <button
        onClick={() => setProfileOpen((v) => !v)}
        title={t.nav.settings}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          profileOpen ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-hover hover:text-foreground"
        }`}
      >
        <Settings className="h-5 w-5" strokeWidth={1.8} />
        {profileOpen && (
          <div className="absolute bottom-12 left-12 z-50">
            <ProfilePanel />
          </div>
        )}
      </button>
    </nav>
  );

  return (
    <>
      {/* MOBILE: Top header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-12 items-center justify-between border-b border-border bg-surface/95 backdrop-blur-sm px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white font-bold shadow-sm">P</div>
          <span className="text-sm font-bold text-foreground">PawCure</span>
        </Link>
        <ProfilePanel />
      </header>

      {/* MOBILE: Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-border bg-surface/95 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Navegación principal"
      >
        {mobileNavItems.map(({ href, label, Icon, exact }) => {
          const active = isMobileNavActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-6 rounded-xl transition-colors ${active ? "bg-primary/12" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? "text-primary" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* DESKTOP: Sidebar — full or icon rail */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-surface transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-16" : "lg:w-72"
        }`}
        aria-label="Menu lateral"
      >
        {isCollapsed ? iconRail : fullSidebar}
      </aside>
    </>
  );
}
