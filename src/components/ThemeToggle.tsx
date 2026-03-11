"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("pawcure-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pawcure-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pawcure-theme", "light");
    }
  };

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors"
        aria-label="Cambiar tema"
      >
        <span className="opacity-0 text-sm">T</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      {dark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
