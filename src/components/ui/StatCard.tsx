"use client";

import React from "react";
import { Database, FileText, Sparkles, Activity } from "lucide-react";
import { DashboardMetric } from "@/types/dashboard.types";
import GlowCard, { GlowColor } from "@/components/ui/GlowCard";

interface StatCardProps {
  metric: DashboardMetric;
}

export default function StatCard({ metric }: StatCardProps) {
  // تحديد الأيقونة والتوهج اللوني المتناسق وفق هوية المنصة المؤسسية
  const getIconAndAccent = (): {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBg: string;
    glowColor: GlowColor;
  } => {
    switch (metric.category) {
      case "queries":
        return {
          icon: Sparkles,
          iconColor: "text-violet-600 dark:text-violet-400",
          iconBg: "bg-violet-50 dark:bg-violet-950/60 border-violet-100 dark:border-violet-800/50",
          glowColor: "purple",
        };
      case "data-sources":
        return {
          icon: Database,
          iconColor: "text-cyan-600 dark:text-cyan-400",
          iconBg: "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-100 dark:border-cyan-800/50",
          glowColor: "cyan",
        };
      case "documents":
        return {
          icon: FileText,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-800/50",
          glowColor: "blue",
        };
      case "status":
      default:
        return {
          icon: Activity,
          iconColor: "text-emerald-600 dark:text-emerald-400",
          iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800/50",
          glowColor: "emerald",
        };
    }
  };

  const { icon: Icon, iconColor, iconBg, glowColor } = getIconAndAccent();

  return (
    <GlowCard glowColor={glowColor} className="h-full">
      {/* الترويسة العلوية للكارد والأيقونة */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
          {metric.title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 duration-300 ${iconBg}`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {/* الرقم الرئيسي والمؤشر التفاعلي */}
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums font-mono">
            {metric.value}
          </span>
          {metric.changePercent && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                metric.changeType === "positive"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                  : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              {metric.changePercent}
            </span>
          )}
        </div>

        {/* النص التوضيحي للبطاقة */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {metric.subtext}
        </p>
      </div>

      {/* شارة توضيحية شفافة للبيانات التجريبية */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>مؤشر موثق (Mock)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500 transition-colors"></span>
      </div>
    </GlowCard>
  );
}
