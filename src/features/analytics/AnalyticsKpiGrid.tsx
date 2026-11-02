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
import GlowCard, { GlowColor } from "@/components/ui/GlowCard";

interface AnalyticsKpiGridProps {
  kpis: AnalyticsKpiItem[];
}

export default function AnalyticsKpiGrid({ kpis }: AnalyticsKpiGridProps) {
  const getKpiConfig = (id: string): {
    icon: React.ReactNode;
    glowColor: GlowColor;
    sparklineData: number[];
    strokeColor: string;
    gradientId: string;
  } => {
    switch (id) {
      case "kpi-queries":
        return {
          icon: <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          glowColor: "blue",
          sparklineData: [20, 28, 25, 40, 35, 52, 48, 64],
          strokeColor: "#3b82f6",
          gradientId: "sparkline-queries",
        };
      case "kpi-latency":
        return {
          icon: <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          glowColor: "amber",
          sparklineData: [60, 52, 48, 42, 38, 30, 28, 22],
          strokeColor: "#f59e0b",
          gradientId: "sparkline-latency",
        };
      case "kpi-accuracy":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          glowColor: "emerald",
          sparklineData: [88, 90, 92, 93, 94.5, 95.8, 96.2, 96.8],
          strokeColor: "#10b981",
          gradientId: "sparkline-accuracy",
        };
      case "kpi-sources":
        return {
          icon: <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          glowColor: "purple",
          sparklineData: [3, 4, 4, 5, 6, 7, 7, 8],
          strokeColor: "#8b5cf6",
          gradientId: "sparkline-sources",
        };
      default:
        return {
          icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
          glowColor: "blue",
          sparklineData: [10, 15, 12, 18, 16, 20, 22, 25],
          strokeColor: "#64748b",
          gradientId: "sparkline-default",
        };
    }
  };

  // توليد مسار الـ SVG للمنحنى المصغر (Mini SVG Sparkline)
  const renderSparkline = (
    data: number[],
    strokeColor: string,
    gradientId: string,
    isPositive: boolean
  ) => {
    const width = 120;
    const height = 36;
    const padding = 3;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x, y };
    });

    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      linePath += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-24 sm:w-28 h-8 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={isPositive ? "0.35" : "0.2"} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* النقطة الأخيرة البارزة */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="2.5"
          fill={strokeColor}
          className="animate-pulse"
        />
      </svg>
    );
  };

  const renderTrendIndicator = (kpi: AnalyticsKpiItem) => {
    const isPositive = kpi.trendSentiment === "positive";
    const isNegative = kpi.trendSentiment === "negative";

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* شارة النسبة والرمز */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border transition-colors ${
              isPositive
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                : isNegative
                ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {kpi.trendDirection === "up" && <TrendingUp className="w-3.5 h-3.5" />}
            {kpi.trendDirection === "down" && <TrendingDown className="w-3.5 h-3.5" />}
            {kpi.trendDirection === "neutral" && <Minus className="w-3.5 h-3.5" />}
            <span dir="ltr" className="font-mono">{kpi.changeRate}</span>
          </span>

          {/* نص وصفي صريح يوضح الحالة */}
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {isPositive ? "(مؤشر إيجابي)" : isNegative ? "(مؤشر سلبي)" : "(مستقر)"}
          </span>
        </div>

        {/* التوضيح الدلالي الكامل */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {kpi.sentimentText}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const config = getKpiConfig(kpi.id);
        const isPositive = kpi.trendSentiment === "positive";

        return (
          <GlowCard key={kpi.id} glowColor={config.glowColor} className="h-full">
            {/* ترويسة البطاقة */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {kpi.title}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {kpi.periodLabel}
                </span>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                {config.icon}
              </div>
            </div>

            {/* القيمة الكبيرة والوحدة مع المنحنى المصغر (Mini SVG Sparkline) */}
            <div className="flex items-end justify-between gap-2 my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.unit}
                </span>
              </div>

              {/* المنحنى المصغر (Mini SVG Sparkline) المضمن */}
              <div className="pb-1" title={`المسار الاتجاهي لـ ${kpi.title}`}>
                {renderSparkline(
                  config.sparklineData,
                  config.strokeColor,
                  config.gradientId,
                  isPositive
                )}
              </div>
            </div>

            {/* مؤشر الاتجاه والنص الصريح */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5">
              {renderTrendIndicator(kpi)}
            </div>
          </GlowCard>
        );
      })}
    </div>
  );
}
