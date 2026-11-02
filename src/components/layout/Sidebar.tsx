"use client";

import React, { useState } from "react";
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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

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
  const { user, signOut } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const userInitial = user?.email ? user.email.slice(0, 2).toUpperCase() : "م/";
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "مستخدم موثق");
  const displayEmail = user?.email || "جلسة موثقة";

  const renderSidebarContent = (isMobileView = false) => {
    // في الجوال نعرض المحتوى كاملاً دائماً بدون طي
    const collapsed = isMobileView ? false : isCollapsed;

    return (
      <div className="h-full flex flex-col bg-[#0B132B] dark:bg-[#070B19]/95 backdrop-blur-2xl text-slate-200 border-l border-slate-800/80 dark:border-white/10 select-none transition-all duration-300">
        {/* 1. رأس القائمة والشعار وزر الطي الذكي */}
        <div
          className={`h-16 flex items-center ${
            collapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
          } border-b border-slate-800/80 dark:border-white/10 shrink-0 relative`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* أيقونة الشعار المؤسسي */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0 ring-1 ring-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            {/* النص والعنوان الرئيسي (يختفي بنعومة عند الطي) */}
            {!collapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                <span className="font-bold text-white text-base leading-none tracking-tight font-sans truncate">
                  ذكاء الأعمال AI
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                  منصة التحليلات المؤسسية
                </span>
              </div>
            )}
          </div>

          {/* زر طي / توسيع الشريط الجانبي في شاشات الحاسوب */}
          {!isMobileView && (
            <button
              type="button"
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 dark:hover:bg-slate-800 transition-all cursor-pointer ${
                collapsed ? "absolute -left-3 top-5 bg-[#0B132B] dark:bg-slate-800 border border-slate-700 shadow-md rounded-full p-1" : ""
              }`}
              title={collapsed ? "توسيع الشريط الجانبي (Expand)" : "تصغير الشريط الجانبي (Collapse)"}
              aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
            >
              {collapsed ? (
                <ChevronLeft className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 hover:text-white" />
              )}
            </button>
          )}

          {/* زر إغلاق القائمة في شاشات الجوال */}
          {isMobileView && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. عناصر التنقل الرئيسية */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              شاشات المنصة
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // كبسولة زجاجية متوهجة للقسم النشط (Glass Capsule Active Indicator)
            const activeBgClass = item.isAi
              ? "bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90 text-white font-semibold shadow-[0_0_22px_rgba(139,92,246,0.45)] border border-white/20 backdrop-blur-xl"
              : "bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-indigo-600/90 text-white font-semibold shadow-[0_0_22px_rgba(59,130,246,0.45)] border border-white/20 backdrop-blur-xl";

            const inactiveClass =
              "text-slate-300 hover:text-white hover:bg-slate-800/60 dark:hover:bg-slate-800/40 font-medium border border-transparent";

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group relative flex items-center ${
                    collapsed ? "justify-center p-2.5" : "justify-between px-3.5 py-2.5"
                  } rounded-xl text-sm transition-all duration-200 ${
                    isActive ? activeBgClass : inactiveClass
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : item.isAi
                          ? "text-violet-400 group-hover:text-violet-300"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>

                  {/* شارة الذكاء الاصطناعي في الوضع العادي المفتوح */}
                  {!collapsed && item.isAi && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border transition-colors ${
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-violet-950/80 text-violet-300 border-violet-700/60 group-hover:bg-violet-900"
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  )}
                </Link>

                {/* التلميح العائم الفاخر (Floating Tooltip) عند تمرير الماوس في الوضع المصغر */}
                {collapsed && hoveredItem === item.href && (
                  <div
                    className="fixed z-50 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-[#0B132B]/95 text-white text-xs font-semibold shadow-2xl border border-white/15 backdrop-blur-xl flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-right-2 duration-150"
                    style={{
                      right: "78px",
                      // يتم محاذاة التلميح تلقائياً مع ارتفاع العنصر
                      marginTop: "-34px",
                    }}
                  >
                    <span>{item.name}</span>
                    {item.isAi && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-600/40 text-violet-200 border border-violet-400/30">
                        <Sparkles className="w-2 h-2" />
                        AI
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. بطاقة المستخدم وتسجيل الخروج في الأسفل */}
        <div
          className={`p-3 border-t border-slate-800/80 dark:border-white/10 shrink-0 ${
            collapsed ? "space-y-2 flex flex-col items-center" : "space-y-2 bg-[#080E21]/60"
          }`}
        >
          {collapsed ? (
            <>
              {/* أيقونة المستخدم المصغرة */}
              <Link
                href="/pending-setup"
                title={`${displayName} (${displayEmail})`}
                className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 font-mono hover:bg-blue-500/30 border border-blue-500/30 transition-all group"
              >
                {userInitial}
              </Link>

              {/* زر تسجيل الخروج المصغر */}
              <button
                type="button"
                onClick={() => signOut()}
                title="تسجيل الخروج"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/pending-setup"
                title="عرض حالة التوثيق وإعداد المؤسسة"
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-850/60 hover:bg-slate-800/90 border border-slate-800 dark:border-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 font-mono border border-blue-500/30">
                  {userInitial}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate">{displayName}</span>
                  <span className="text-[10px] text-slate-400 truncate" dir="ltr">
                    {displayEmail}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>تسجيل الخروج</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. القائمة الثابتة على شاشات الحاسوب (تتقلص وتتوسع بنعومة فائقة) */}
      <aside
        className={`hidden md:flex shrink-0 min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {renderSidebarContent(false)}
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
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
