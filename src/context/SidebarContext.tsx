"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = "enterprise_sidebar_collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // تهيئة الحالة بشكل كسول وقراءة التخزين المحلي مباشرة لتجنب cascading renders
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (stored !== null) {
          return stored === "true";
        }
      } catch {
        // safe fallback
      }
    }
    return false;
  });

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // safe fallback
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // safe fallback
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isCollapsed,
      toggleSidebar,
      setIsCollapsed,
    }),
    [isCollapsed, toggleSidebar, setIsCollapsed]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
