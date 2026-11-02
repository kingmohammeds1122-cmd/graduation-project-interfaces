"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, Sparkles, Command } from "lucide-react";
import { navigationItems } from "./Sidebar";
import CommandPalette from "./CommandPalette";
import DayNightSwitch from "@/components/ui/DayNightSwitch";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const currentItem = navigationItems.find((item) => item.href === pathname);
  const title = currentItem ? currentItem.name : "المنصة";

  return (
    <>
      <header className="h-16 bg-white/85 dark:bg-[#070B19]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0 transition-colors duration-200">
        {/* 1. الجانب الأيمن: زر القائمة في الجوال وعنوان الشاشة الحالية */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* زر فتح القائمة الجانبية في شاشات الجوال */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="فتح القائمة الرئيسية"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-none font-sans">
              {title}
            </h1>

            {/* شارة توضيحية خفيفة للشاشة */}
            {currentItem?.isAi ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-700/60 shadow-2xs">
                <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                <span>مساعد الذكاء الاصطناعي</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                <span>مسار معتمد</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. الجانب الأيسر: مفتاح التبديل الليلي/النهاري، مؤشر الحالة الحية، البحث والأدوات المؤسسية */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* مفتاح التبديل المتحرك بين الوضع الفاتح والوضع الداكن الزجاجي (Day/Night Cloud & Moon Switch) */}
          <DayNightSwitch id="header-theme-toggle" />

          {/* مؤشر حالة النظام الحي */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px]">متصل</span>
          </div>

          {/* مؤشر وضع البيانات التجريبية */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px]">محاكاة (Mock)</span>
          </div>

          {/* زر البحث السريع وفتح نافذة الأوامر في شاشات الجوال/الأجهزة اللوحية */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="البحث السريع (Ctrl+K)"
            aria-label="فتح نافذة الأوامر والبحث السريع"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* حقل بحث تفاعلي يفتح نافذة الأوامر الزجاجية الفاخرة (Command Palette Trigger) */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative hidden lg:flex items-center w-52 xl:w-64 bg-slate-50/90 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-blue-400/50 rounded-xl py-1.5 pr-8 pl-10 text-xs text-slate-500 dark:text-slate-400 transition-all cursor-pointer shadow-2xs group text-right"
            title="فتح نافذة الأوامر والبحث السريع (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 absolute right-3 pointer-events-none transition-colors" />
            <span className="truncate">بحث سريع في المنصة...</span>
            <div className="absolute left-2.5 flex items-center">
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs group-hover:border-blue-400/40">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          </button>

          {/* زر التنبيهات المؤسسي */}
          <button
            type="button"
            title="الإشعارات والتنبيهات"
            className="relative p-2 rounded-xl text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            disabled
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-slate-500 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>
      </header>

      {/* نافذة الأوامر والبحث السريع المضمنة */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
