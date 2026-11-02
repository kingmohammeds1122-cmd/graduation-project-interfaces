"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "enterprise_theme";
const THEME_COOKIE_MAX_AGE = 31536000; // 1 year (365 days)

function updateDocumentTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = mode === "dark";
  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
}

function persistTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // safe fallback
  }
  try {
    document.cookie = `${THEME_STORAGE_KEY}=${mode}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // safe fallback
  }
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}) {
  // تهيئة الثيم بشكل كسول مع دعم الكوكيز والتخزين المحلي
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const cookieTheme = document.cookie.match(/(?:^|;\s*)enterprise_theme=([^;]+)/)?.[1] as ThemeMode | undefined;
        const storedTheme = (cookieTheme || localStorage.getItem(THEME_STORAGE_KEY)) as ThemeMode | null;
        if (storedTheme === "dark" || storedTheme === "light") {
          return storedTheme;
        }
        if (document.documentElement.classList.contains("dark")) {
          return "dark";
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      } catch {
        // safe fallback
      }
    }
    return initialTheme;
  });

  // مزامنة حالة كلاس html مع النظام الخارجي (DOM) والكوكيز عند تغيير الثيم دون تكرار التحديثات المتتالية
  useEffect(() => {
    try {
      updateDocumentTheme(theme);
      persistTheme(theme);
    } catch {
      // safe fallback
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    updateDocumentTheme(newTheme);
    persistTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      updateDocumentTheme(nextTheme);
      persistTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
