"use client";

import React from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileSearch,
  Database,
  ShieldCheck,
  Info,
} from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface QuotaGauge {
  id: string;
  title: string;
  englishTitle: string;
  actualValue: number;
  targetValue: number;
  unit: string;
  status: "surpassed" | "on-track" | "warning";
  statusText: string;
  description: string;
  barGradient: string;
  glowShadow: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUOTA_GAUGES: QuotaGauge[] = [
  {
    id: "rag-accuracy",
    title: "دقة استرجاع الـ RAG واستبعاد الهلوسات",
    englishTitle: "RAG Retrieval Accuracy",
    actualValue: 96.8,
    targetValue: 95.0,
    unit: "%",
    status: "surpassed",
    statusText: "متجاوز للمستهدف (+1.8%)",
    description: "مطابقة تشابه متجهات Cosine واستبعاد الإجابات غير الموثقة",
    barGradient: "bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600",
    glowShadow: "shadow-[0_0_12px_rgba(139,92,246,0.45)]",
    icon: Sparkles,
  },
  {
    id: "doc-indexing",
    title: "تغطية فهرسة المستندات وقواعد المعرفة",
    englishTitle: "Document Indexing Coverage",
    actualValue: 99.2,
    targetValue: 98.0,
    unit: "%",
    status: "surpassed",
    statusText: "148 من 149 ملفاً مفهرساً",
    description: "تجزئة النصوص وتحويلها لمتجهات 1536-dim لحظياً",
    barGradient: "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600",
    glowShadow: "shadow-[0_0_12px_rgba(6,182,212,0.45)]",
    icon: FileSearch,
  },
  {
    id: "sql-efficiency",
    title: "كفاءة استعلامات SQL ونسبة الكاش",
    englishTitle: "SQL Query Efficiency & Cache",
    actualValue: 94.5,
    targetValue: 90.0,
    unit: "%",
    status: "surpassed",
    statusText: "استجابة 64ms لكل استعلام",
    description: "تحسين صياغة الاستعلامات وتخفيف العبء على قاعدة البيانات",
    barGradient: "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600",
    glowShadow: "shadow-[0_0_12px_rgba(16,185,129,0.45)]",
    icon: Database,
  },
  {
    id: "session-integrity",
    title: "سلامة الجلسات ومطابقة معايير Zero-Trust",
    englishTitle: "Zero-Trust Session Integrity",
    actualValue: 100,
    targetValue: 100,
    unit: "%",
    status: "surpassed",
    statusText: "حماية تامة و 2FA إلزامي",
    description: "تشفير AES-256 للمفاتيح ومراقبة مستمرة لنشاط الجلسات",
    barGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500",
    glowShadow: "shadow-[0_0_12px_rgba(59,130,246,0.45)]",
    icon: ShieldCheck,
  },
];

export default function PerformanceGaugesCard() {
  return (
    <GlowCard glowColor="purple" className="w-full">
      {/* 1. الترويسة العلوية للكارد */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-800/50 flex items-center justify-center text-violet-600 dark:text-violet-300 shadow-2xs shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                مقاييس الكفاءة والمستهدفات المؤسسية
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                SLA Benchmarks
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              متابعة دقة النماذج، تغطية الفهرسة، وسرعة الاستجابة وفق معايير الجودة المعتمدة
            </p>
          </div>
        </div>

        {/* شارة الـ SLA */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>مستوى الخدمة (SLA): 99.9% متاح</span>
        </div>
      </div>

      {/* 2. مؤشرات الأداء المتوهجة (Glowing Progress Bars / Gauges Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {QUOTA_GAUGES.map((gauge) => {
          const Icon = gauge.icon;

          return (
            <div
              key={gauge.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/5 space-y-3 transition-colors hover:border-slate-300 dark:hover:border-white/10"
            >
              {/* معلومات المؤشر والمستهدف */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {gauge.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate block" dir="ltr">
                      {gauge.englishTitle}
                    </span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {gauge.actualValue}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      {gauge.unit}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    المستهدف: {gauge.targetValue}%
                  </span>
                </div>
              </div>

              {/* شريط القياس المتدرج المضيء (Glowing Progress Bar) */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${gauge.barGradient} ${gauge.glowShadow}`}
                    style={{ width: `${gauge.actualValue}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] pt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{gauge.statusText}</span>
                  </span>
                  <span className="text-slate-400 font-medium">
                    {gauge.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. تذييل الكارد الإرشادي */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>تُقاس المؤشرات دورياً كل 60 ثانية لضمان دقة الاسترجاع واستمرارية الخدمة.</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">Benchmark Engine v2.4</span>
      </div>
    </GlowCard>
  );
}
