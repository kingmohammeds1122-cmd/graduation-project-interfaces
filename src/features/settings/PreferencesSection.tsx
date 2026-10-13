"use client";

import React, { useState } from "react";
import {
  Globe,
  Sun,
  LayoutGrid,
  Type,
  Sparkles,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import { UiPreferences, InterfaceLanguage, InterfaceTheme, InterfaceFontSize } from "@/types/settings.types";

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
  const [lang, setLang] = useState<InterfaceLanguage>(preferences.language);
  const [theme, setTheme] = useState<InterfaceTheme>(preferences.theme);
  const [fontSize, setFontSize] = useState<InterfaceFontSize>(preferences.fontSize);
  const [compactMode, setCompactMode] = useState(preferences.compactMode);
  const [showTips, setShowTips] = useState(preferences.showAiGuidanceTips);

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
      className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6"
    >
      {/* الترويسة */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          تفضيلات العرض والمظهر العام
        </h3>
        <p className="text-xs text-slate-500">
          تخصيص أسلوب العرض وتجربة التفاعل البصرية مع الواجهة
        </p>
      </div>

      {/* خيارات التفضيلات */}
      <div className="space-y-5 text-xs">
        {/* 1. لغة الواجهة */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">لغة الواجهة (Interface Language)</span>
              <p className="text-slate-500 text-[11px]">
                اللغة المعتمدة حالياً هي العربية مع دعم اتجاه اليمين إلى اليسار (RTL).
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                lang === "ar"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              العربية (افتراضي RTL)
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English (معاينة)
            </button>
          </div>
        </div>

        {/* 2. سمة المظهر */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">سمة المظهر (Theme)</span>
              <p className="text-slate-500 text-[11px]">
                السمة المؤسسية المعتمدة هي المظهر الفاتح المريح لقراءة البيانات وجداول التحليلات.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              فاتح مؤسسي
            </button>
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                theme === "system"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              تلقائي (حسب النظام)
            </button>
          </div>
        </div>

        {/* 3. حجم الخطوط */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Type className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">حجم النصوص والخطوط</span>
              <p className="text-slate-500 text-[11px]">
                مستوى تكبير الخطوط وقراءة الجداول والأرقام في المنصة.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFontSize("normal")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                fontSize === "normal"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              قياسي (Cairo)
            </button>
            <button
              type="button"
              onClick={() => setFontSize("large")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                fontSize === "large"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              كبير ومريح
            </button>
          </div>
        </div>

        {/* 4. نمط العرض المضغوط */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">نمط العرض المضغوط (Compact View)</span>
              <p className="text-slate-500 text-[11px]">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* 5. إرشادات الذكاء الاصطناعي */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 text-sm block">تلميحات مساعد الذكاء الاصطناعي</span>
              <p className="text-slate-500 text-[11px]">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* التذييل والتنبيه */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>التفضيلات تسري على المعاينة المحلية فقط ولن تُحفظ على أي خادم بعد.</span>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>جاري الحفظ التجريبي...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التفضيلات تجريبياً</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
