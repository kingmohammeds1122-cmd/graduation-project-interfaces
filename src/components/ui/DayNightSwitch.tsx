"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface DayNightSwitchProps {
  className?: string;
  id?: string;
}

export default function DayNightSwitch({
  className = "",
  id = "day-night-toggle-btn",
}: DayNightSwitchProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id={id}
      onClick={toggleTheme}
      dir="ltr"
      aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      title={isDark ? "الوضع الليلي نشط (انقر للوضع النهاري)" : "الوضع النهاري نشط (انقر للوضع الليلي)"}
      aria-pressed={isDark}
      className={`group relative w-20 h-9 rounded-full p-1 cursor-pointer overflow-hidden transition-all duration-500 select-none shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isDark
          ? "bg-gradient-to-r from-[#070b19] via-[#0f172a] to-[#1e1b4b] border border-indigo-500/40 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 border border-sky-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
      } ${className}`}
    >
      {/* 1. عناصر النهار (الغيوم الناعمة) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-out ${
          isDark
            ? "opacity-0 translate-y-3 scale-90"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* سحابة نهارية رئيسية */}
        <div className="absolute left-2.5 top-2.5 flex items-center">
          <div className="w-5 h-2.5 bg-white/90 rounded-full shadow-2xs relative">
            <div className="absolute -top-1.5 left-1 w-2.5 h-2.5 bg-white/95 rounded-full" />
            <div className="absolute -top-2 left-2 w-3 h-3 bg-white rounded-full" />
          </div>
        </div>

        {/* سحابة نهارية ثانوية خفيفة */}
        <div className="absolute left-5 top-5 flex items-center opacity-85">
          <div className="w-4 h-2 bg-white/80 rounded-full relative">
            <div className="absolute -top-1 left-1 w-2 h-2 bg-white/90 rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. عناصر الليل (النجوم المتلألئة في السماء الداكنة) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-out ${
          isDark
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-3 scale-90"
        }`}
      >
        {/* نجمة 1 */}
        <span className="absolute left-[44px] top-2 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse shadow-[0_0_4px_rgba(253,230,138,0.8)]" />
        {/* نجمة 2 */}
        <span className="absolute left-[58px] top-4 w-1 h-1 bg-white rounded-full shadow-[0_0_3px_rgba(255,255,255,0.9)]" />
        {/* نجمة 3 متوهجة */}
        <span className="absolute left-[64px] top-2 w-1.5 h-1.5 bg-sky-200 rounded-full animate-ping [animation-duration:3s]" />
        {/* نجمة 4 دقيقة */}
        <span className="absolute left-[50px] top-5 w-0.5 h-0.5 bg-white/80 rounded-full" />
      </div>

      {/* 3. القرص المنزلق التفاعلي (الشمس الذهبية ⇄ القمر المضيء) */}
      <div
        className={`absolute top-1 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 ${
          isDark
            ? "left-1 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 shadow-[0_0_14px_rgba(255,255,255,0.7)] ring-1 ring-white/60 text-slate-800"
            : "left-[48px] bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.9)] ring-1 ring-amber-200 text-amber-950"
        }`}
      >
        {isDark ? (
          <div className="relative flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 fill-slate-800 stroke-slate-800 transition-transform duration-300 group-hover:scale-110" />
            {/* تفاصيل فوهات القمر الصغيرة */}
            <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-slate-400/40" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <Sun className="w-4 h-4 text-amber-950 stroke-[2.2] transition-transform duration-300 group-hover:rotate-45" />
          </div>
        )}
      </div>
    </button>
  );
}
