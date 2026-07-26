"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }
  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setTheme(getPreferredTheme());
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      tabIndex={-1}
      className="relative h-5 w-5 text-foreground/60 transition hover:text-foreground"
    >
      <MoonIcon className="theme-icon theme-icon-dark" />
      <SunIcon className="theme-icon theme-icon-light" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 fill-current ${className ?? ""}`}
    >
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.93 6.34a1 1 0 0 1 1.41 0l1.06 1.06A1 1 0 0 1 5.99 8.8L4.93 7.75a1 1 0 0 1 0-1.41Zm11.67 11.66a1 1 0 0 1 1.41 0l1.06 1.07a1 1 0 0 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.42ZM18.5 11a1 1 0 1 1 0 2H20a1 1 0 1 1 0-2h-1.5ZM3 11a1 1 0 1 1 0 2H4.5a1 1 0 1 1 0-2H3Zm16.07-4.66a1 1 0 0 1 0 1.41L18 8.8a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.42 0ZM7.4 16.6a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41L5.99 16.6a1 1 0 0 1 1.41 0Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7.2 7.2 0 0 0 21 12.8Z" />
    </svg>
  );
}
