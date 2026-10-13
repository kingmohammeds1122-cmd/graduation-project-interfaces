"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, Sparkles } from "lucide-react";
import { navigationItems } from "./Sidebar";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();

  const currentItem = navigationItems.find((item) => item.href === pathname);
  const title = currentItem ? currentItem.name : "المنصة";

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* 1. الجانب الأيمن: زر القائمة في الجوال وعنوان الشاشة الحالية */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* زر فتح القائمة الجانبية في شاشات الجوال */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="فتح القائمة الرئيسية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-none">
            {title}
          </h1>

          {/* شارة توضيحية خفيفة للشاشة */}
          {currentItem?.isAi ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              <Sparkles className="w-3 h-3 text-violet-600" />
              محرك الذكاء الاصطناعي
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              مسار معتمد
            </span>
          )}
        </div>
      </div>

      {/* 2. الجانب الأيسر: مؤشر الحالة والأدوات المؤسسية */}
      <div className="flex items-center gap-2.5 md:gap-4">
        {/* مؤشر وضع البيانات التجريبية */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>وضع تجريبي: بيانات محاكاة</span>
        </div>

        {/* حقل بحث شكلي منظم */}
        <div className="relative hidden md:block w-56">
          <input
            type="text"
            placeholder="بحث سريع في المنصة..."
            disabled
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pr-8 pl-3 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* زر التنبيهات المؤسسي (معلّم بأنه تجريبي) */}
        <button
          type="button"
          title="الإشعارات (غير مفعلة في هذه المرحلة)"
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-not-allowed"
          disabled
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-300"></span>
        </button>
      </div>
    </header>
  );
}
