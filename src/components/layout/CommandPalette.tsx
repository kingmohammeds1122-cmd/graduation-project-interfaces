"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Database,
  FileText,
  BarChart3,
  ClipboardList,
  Settings,
  Sparkles,
  PlusCircle,
  Upload,
  Sun,
  Moon,
  ShieldCheck,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "navigation" | "actions" | "system";
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // إعداد قائمة الأوامر المتاحة
  const allCommands: CommandItem[] = [
    // 1. التنقل بين الشاشات الثماني
    {
      id: "nav-dashboard",
      title: "لوحة التحكم والمؤشرات",
      subtitle: "المؤشرات العامة ونبض البنية التحتية",
      category: "navigation",
      icon: LayoutDashboard,
      iconColor: "text-blue-500",
      onSelect: () => {
        router.push("/dashboard");
        onClose();
      },
    },
    {
      id: "nav-chat",
      title: "المحادثة الذكية مع الوكيل",
      subtitle: "استنطاق البيانات والمستندات بالذكاء الاصطناعي",
      category: "navigation",
      icon: MessageSquare,
      iconColor: "text-violet-500",
      badge: "AI Core",
      onSelect: () => {
        router.push("/chat");
        onClose();
      },
    },
    {
      id: "nav-data-sources",
      title: "مصادر البيانات والمزامنة",
      subtitle: "إدارة قواعد البيانات واستكشاف المخططات",
      category: "navigation",
      icon: Database,
      iconColor: "text-cyan-500",
      onSelect: () => {
        router.push("/data-sources");
        onClose();
      },
    },
    {
      id: "nav-documents",
      title: "المستندات وقاعدة المعرفة",
      subtitle: "إدارة الملفات وتوليد متجهات الـ RAG",
      category: "navigation",
      icon: FileText,
      iconColor: "text-blue-500",
      onSelect: () => {
        router.push("/documents");
        onClose();
      },
    },
    {
      id: "nav-analytics",
      title: "التحليلات ومؤشرات الأداء",
      subtitle: "مخططات النمو، زمن الاستجابة، وتوزيع الفئات",
      category: "navigation",
      icon: BarChart3,
      iconColor: "text-emerald-500",
      onSelect: () => {
        router.push("/analytics");
        onClose();
      },
    },
    {
      id: "nav-reports",
      title: "التقارير وسجل التصدير",
      subtitle: "استعراض وتنزيل تقارير الأداء والمستندات",
      category: "navigation",
      icon: ClipboardList,
      iconColor: "text-amber-500",
      onSelect: () => {
        router.push("/reports");
        onClose();
      },
    },
    {
      id: "nav-settings",
      title: "الإعدادات وحساب المؤسسة",
      subtitle: "الملف التعريفي، الصلاحيات، والتنبيهات",
      category: "navigation",
      icon: Settings,
      iconColor: "text-slate-500",
      onSelect: () => {
        router.push("/settings");
        onClose();
      },
    },
    {
      id: "nav-pending-setup",
      title: "حالة التوثيق والإعداد المؤسسي",
      subtitle: "إعدادات الهوية المؤسسية وحالة التحقق",
      category: "navigation",
      icon: ShieldCheck,
      iconColor: "text-indigo-500",
      onSelect: () => {
        router.push("/pending-setup");
        onClose();
      },
    },

    // 2. إجراءات سريعة (Quick Actions)
    {
      id: "action-new-chat",
      title: "بدء جلسة استفسار ذكية جديدة",
      subtitle: "فتح نافذة المحادثة المباشرة",
      category: "actions",
      icon: Sparkles,
      iconColor: "text-violet-500",
      badge: "فوري",
      onSelect: () => {
        router.push("/chat");
        onClose();
      },
    },
    {
      id: "action-add-source",
      title: "ربط مصدر بيانات جديد",
      subtitle: "إضافة اتصال PostgreSQL أو MySQL جديد",
      category: "actions",
      icon: PlusCircle,
      iconColor: "text-cyan-500",
      onSelect: () => {
        router.push("/data-sources?action=add");
        onClose();
      },
    },
    {
      id: "action-upload-doc",
      title: "رفع مستند جديد لقاعدة المعرفة",
      subtitle: "معالجة وتضمين ملف PDF / Word",
      category: "actions",
      icon: Upload,
      iconColor: "text-blue-500",
      onSelect: () => {
        router.push("/documents?action=upload");
        onClose();
      },
    },

    // 3. أدوات النظام (System Tools)
    {
      id: "system-toggle-theme",
      title: isDark ? "التحويل للوضع الفاتح المؤسسي" : "التحويل للوضع الداكن الزجاجي",
      subtitle: isDark ? "Corporate Light Mode" : "Glassy Dark Mode",
      category: "system",
      icon: isDark ? Sun : Moon,
      iconColor: isDark ? "text-amber-400" : "text-blue-400",
      badge: "مظهر",
      onSelect: () => {
        toggleTheme();
        onClose();
      },
    },
  ];

  // تصفية الأوامر وفق نص البحث
  const filteredCommands = allCommands.filter((cmd) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q))
    );
  });

  // التحكم باختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // فتح النافذة بـ Ctrl+K أو Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        onClose();
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? (filteredCommands.length || 1) - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // التركيز التلقائي على حقل البحث وإعادة ضبط الحالة
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4" dir="rtl">
      {/* خلفية معتمة قابلة للنقر للإغلاق */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-[#070B19]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* بطاقة نافذة الأوامر الزجاجية الفاخرة */}
      <div className="w-full max-w-2xl bg-white/95 dark:bg-[#0B132B]/95 border border-slate-200/90 dark:border-white/15 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        {/* حقل البحث العلوي */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center gap-3 shrink-0">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ابحث عن شاشة، إجراء سريع، أو مستند..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>

        {/* قائمة النتائج والأوامر */}
        <div className="p-2 sm:p-3 overflow-y-auto space-y-1 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              لا توجد نتائج مطابقة لـ &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-right transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-white/10"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-white" : cmd.iconColor}`} />
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold block truncate">
                        {cmd.title}
                      </span>
                      {cmd.subtitle && (
                        <span
                          className={`text-[11px] block truncate ${
                            isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {cmd.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isSelected
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {cmd.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-white/90 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* شريط الإرشادات السفلي */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[9px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[9px]">
                ↓
              </kbd>
              <span>للتنقل</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[9px]">
                Enter
              </kbd>
              <span>للتنفيذ</span>
            </span>
          </div>

          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[9px]">
              Esc
            </kbd>
            <span>للإغلاق</span>
          </span>
        </div>
      </div>
    </div>
  );
}
