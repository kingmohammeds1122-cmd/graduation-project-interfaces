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
    "bg-blue-600",
    "bg-purple-600",
    "bg-cyan-500",
    "bg-slate-500",
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. الترويسة */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      {/* 2. شريط التوزيع المكدس الكلي (Stacked Distribution Bar) */}
      <div className="space-y-1.5">
        <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200/70">
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
              className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${colorClass} shrink-0 mt-0.5`}
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 block">
                    {segment.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {segment.formattedCount} • <span className="font-medium text-slate-400">{segment.colorName}</span>
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-left">
                <span className="font-mono font-bold text-slate-900 text-sm block">
                  {segment.percentage}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold">
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
