"use client";

import React from "react";
import { PieChart, CheckCircle2 } from "lucide-react";
import { DistributionSegment } from "@/types/analytics.types";

interface AnalyticsDistributionCardProps {
  title: string;
  description: string;
  items: DistributionSegment[];
}

export default function AnalyticsDistributionCard({
  title,
  description,
  items,
}: AnalyticsDistributionCardProps) {
  // تدرجات الألوان المتناسقة مع نظام التصميم المؤسسي
  const segmentGradients = [
    "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    "bg-gradient-to-r from-purple-600 to-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.5)]",
    "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
    "bg-gradient-to-r from-slate-500 to-slate-600",
  ];

  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* 1. الترويسة */}
      <div className="border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* 2. شريط التوزيع المكدس الكلي (Stacked Distribution Bar) */}
      <div className="space-y-1.5">
        <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/70 dark:border-white/10">
          {items.map((segment, idx) => (
            <div
              key={segment.id}
              className={`${segmentGradients[idx % segmentGradients.length]} h-full transition-all duration-300 first:rounded-r-lg last:rounded-l-lg`}
              style={{ width: `${segment.percentage}%` }}
              title={`${segment.name}: ${segment.percentage}%`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 3. قائمة التوزيع التفصيلية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {items.map((segment, idx) => {
          const colorClass = segmentGradients[idx % segmentGradients.length];

          return (
            <div
              key={segment.id}
              className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 flex items-start justify-between gap-2 text-xs transition-colors hover:border-slate-300 dark:hover:border-white/10"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${colorClass} shrink-0 mt-0.5`}
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {segment.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {segment.formattedCount} • <span className="font-medium text-slate-400">{segment.colorName}</span>
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-left">
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block tabular-nums">
                  {segment.percentage}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>معتمد</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
