"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  FileText,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";

export const navigationItems = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "المحادثة الذكية", href: "/chat", icon: MessageSquare, isAi: true },
  { name: "مصادر البيانات", href: "/data-sources", hrefSub: "مزامنة", icon: Database },
  { name: "المستندات", href: "/documents", icon: FileText },
  { name: "التحليلات", href: "/analytics", icon: BarChart3 },
  { name: "التقارير", href: "/reports", icon: ClipboardList },
  { name: "الإعدادات", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isOpenOnMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#0F172A] text-slate-200 border-l border-slate-800 select-none">
      {/* 1. رأس القائمة والشعار */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base leading-none tracking-tight">
              ذكاء الأعمال AI
            </span>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">منصة التحليلات</span>
          </div>
        </div>

        {/* زر إغلاق القائمة في شاشات الجوال */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. عناصر التنقل الرئيسية */}
      <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 tracking-wider">
          شاشات المنصة
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-white" : item.isAi ? "text-violet-400" : "text-slate-400"
                    }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {/* شارة الذكاء الاصطناعي البنفسجية المخصصة لشاشة المحادثة فقط */}
              {item.isAi && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${isActive
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-violet-950/70 text-violet-300 border-violet-800/60"
                    }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. بطاقة المستخدم وتسجيل الخروج */}
      <div className="p-4 border-t border-slate-800/90 shrink-0 space-y-3 bg-[#0B132B]/40">
        <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
            م/
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">محمد سند</span>
            <span className="text-[10px] text-slate-400 truncate">admin@company.com</span>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. القائمة الثابتة على شاشات الحاسوب والأجهزة اللوحية (Desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* 2. القائمة المنبثقة التفاعلية على شاشات الهواتف الذكية (Mobile Drawer) */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* خلفية معتمة قابلة للنقر للإغلاق */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* درج القائمة المنزلق من اليمين (RTL) */}
          <aside className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
