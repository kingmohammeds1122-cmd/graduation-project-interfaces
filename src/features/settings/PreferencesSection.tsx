"use client";

import React, { useState } from "react";
import {
  Globe,
  Sun,
  Moon,
  LayoutGrid,
  Type,
  Sparkles,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import { UiPreferences, InterfaceLanguage, InterfaceTheme, InterfaceFontSize } from "@/types/settings.types";
import { useTheme } from "@/context/ThemeContext";

interface PreferencesSectionProps {
  preferences: UiPreferences;
  onSavePreferences: (prefs: UiPreferences) => Promise<void>;
  isSaving: boolean;
}

export default function PreferencesSection({
  preferences,
  onSavePreferences,
  isSaving,
}: PreferencesSectionProps) {
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  const [lang, setLang] = useState<InterfaceLanguage>(preferences.language);
  const [theme, setTheme] = useState<InterfaceTheme>(preferences.theme);
  const [fontSize, setFontSize] = useState<InterfaceFontSize>(preferences.fontSize);
  const [compactMode, setCompactMode] = useState(preferences.compactMode);
  const [showTips, setShowTips] = useState(preferences.showAiGuidanceTips);

  const handleThemeChange = (newTheme: InterfaceTheme) => {
    setTheme(newTheme);
    if (newTheme === "light") {
      setActiveTheme("light");
    } else if (newTheme === "system") {
      // Toggle or set to dark
      setActiveTheme(activeTheme === "dark" ? "light" : "dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSavePreferences({
      language: lang,
      theme,
      fontSize,
      compactMode,
      showAiGuidanceTips: showTips,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-xs space-y-6 text-slate-800 dark:text-slate-100"
    >
      {/* الترويسة */}
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          تفضيلات العرض والمظهر العام (Appearance & UX)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تخصيص أسلوب العرض وتجربة التفاعل البصرية مع الواجهة الثنائية (Light / Glassy Dark)
        </p>
      </div>

      {/* خيارات التفضيلات */}
      <div className="space-y-4 text-xs">
        {/* 1. لغة الواجهة */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">لغة الواجهة (Interface Language)</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                اللغة المعتمدة حالياً هي العربية مع دعم اتجاه اليمين إلى اليسار (RTL).
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                lang === "ar"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              العربية (افتراضي RTL)
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* 2. سمة المظهر */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              {activeTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">نظام الثيم المزدوج (Theme System)</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                التبديل بين النمط المؤسسي الفاتح (Corporate Light) والنمط الليلي الزجاجي الفاخر (Glassy Dark).
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTheme("light");
                handleThemeChange("light");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTheme === "light"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>فاتح مؤسسي</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTheme("dark");
                handleThemeChange("system");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTheme === "dark"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>داكن زجاجي (#070B19)</span>
            </button>
          </div>
        </div>

        {/* 3. حجم الخطوط */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Type className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">حجم النصوص والخطوط</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                مستوى تكبير الخطوط وقراءة الجداول والأرقام في المنصة (IBM Plex Sans Arabic).
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFontSize("normal")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                fontSize === "normal"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              قياسي (Standard)
            </button>
            <button
              type="button"
              onClick={() => setFontSize("large")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                fontSize === "large"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              كبير ومريح
            </button>
          </div>
        </div>

        {/* 4. نمط العرض المضغوط */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">نمط العرض المضغوط (Compact View)</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                تقليص المسافات الهامشية في الجداول لعرض عدد أكبر من صفوف البيانات.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* 5. إرشادات الذكاء الاصطناعي */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">تلميحات مساعد الذكاء الاصطناعي</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                إظهار نصائح واقتراحات الاستفسارات التلقائية أثناء استخدام المحادثة.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showTips}
              onChange={(e) => setShowTips(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* التذييل والتنبيه */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>تفضيلات المظهر تسري فورياً وتُحفظ في المتصفح.</span>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التفضيلات</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
