"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "admin-theme";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
  if (shouldBeDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const value = stored === "light" || stored === "dark" ? stored : "system";
    setThemeState(value);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    if (theme === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  function setTheme(value) {
    setThemeState(value);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
