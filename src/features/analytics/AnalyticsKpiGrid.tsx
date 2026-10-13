"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Zap,
  CheckCircle2,
  Database,
  HelpCircle,
} from "lucide-react";
import { AnalyticsKpiItem } from "@/types/analytics.types";

interface AnalyticsKpiGridProps {
  kpis: AnalyticsKpiItem[];
}

export default function AnalyticsKpiGrid({ kpis }: AnalyticsKpiGridProps) {
  const getKpiIcon = (id: string) => {
    switch (id) {
      case "kpi-queries":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "kpi-latency":
        return <Zap className="w-4 h-4 text-amber-600" />;
      case "kpi-accuracy":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "kpi-sources":
        return <Database className="w-4 h-4 text-purple-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderTrendIndicator = (kpi: AnalyticsKpiItem) => {
    const isPositive = kpi.trendSentiment === "positive";
    const isNegative = kpi.trendSentiment === "negative";

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* شارة النسبة والرمز */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : isNegative
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {kpi.trendDirection === "up" && <TrendingUp className="w-3.5 h-3.5" />}
            {kpi.trendDirection === "down" && <TrendingDown className="w-3.5 h-3.5" />}
            {kpi.trendDirection === "neutral" && <Minus className="w-3.5 h-3.5" />}
            <span dir="ltr">{kpi.changeRate}</span>
          </span>

          {/* نص وصفي صريح يوضح الحالة بدون الاعتماد على اللون فقط */}
          <span className="text-[10px] font-semibold text-slate-500">
            {isPositive ? "(مؤشر إيجابي)" : isNegative ? "(مؤشر سلبي)" : "(مستقر)"}
          </span>
        </div>

        {/* التوضيح الدلالي الكامل */}
        <p className="text-[11px] text-slate-500 leading-tight">
          {kpi.sentimentText}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
        >
          {/* ترويسة البطاقة */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-600 block">
                {kpi.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {kpi.periodLabel}
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              {getKpiIcon(kpi.id)}
            </div>
          </div>

          {/* القيمة الكبيرة والوحدة */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              {kpi.value}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {kpi.unit}
            </span>
          </div>

          {/* مؤشر الاتجاه والنص الصريح */}
          <div className="pt-2 border-t border-slate-100">
            {renderTrendIndicator(kpi)}
          </div>
        </div>
      ))}
    </div>
  );
}
