"use client";

import React, { useState } from "react";
import {
  BarChart2,
  Table as TableIcon,
  Database,
  FileSpreadsheet,
  FileText,
  Layers,
} from "lucide-react";
import { CategoryComparisonItem } from "@/types/analytics.types";

interface AnalyticsCategoryChartProps {
  title: string;
  description: string;
  unit: string;
  items: CategoryComparisonItem[];
}

export default function AnalyticsCategoryChart({
  title,
  description,
  unit,
  items,
}: AnalyticsCategoryChartProps) {
  const [viewMode, setViewMode] = useState<"bars" | "table">("bars");
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "cat-db":
        return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "cat-sheets":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "cat-docs":
        return <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    }
  };

  const maxVal = Math.max(...items.map((i) => i.primaryValue), 1);
  const totalVal = items.reduce((sum, i) => sum + i.primaryValue, 0);

  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* 1. الترويسة والتبديل */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              مقارنة فئات
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description} • <span className="font-semibold text-slate-700 dark:text-slate-300">الوحدة: {unit}</span>
          </p>
        </div>

        {/* أزرار التبديل */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("bars")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "bars"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-2xs border border-slate-200/70 dark:border-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>رسم شريطي</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-2xs border border-slate-200/70 dark:border-white/10"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>جدول مقارنة</span>
          </button>
        </div>
      </div>

      {/* 2. المحتوى: أشرطة بيانية متوهجة أو جدول تفصيلي */}
      {viewMode === "bars" ? (
        <div className="space-y-4 pt-1">
          {items.map((item) => {
            const widthPercent = Math.round((item.primaryValue / maxVal) * 100);
            const isHovered = hoveredItemId === item.id;

            return (
              <div
                key={item.id}
                className="space-y-1.5 relative group"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                {/* اسم الفئة والقيم */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.id)}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm tabular-nums">
                      {item.formattedValue}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* شريط التقدم الشريطي المتوهج (Glowing Bar) */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-white/10 relative">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-l from-blue-600 via-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_16px_rgba(59,130,246,0.6)]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>

                {/* نافذة التلميح الزجاجية العائمة (Floating Glass Tooltip on Bar Hover) */}
                {isHovered && (
                  <div className="absolute left-0 -top-8 z-30 bg-slate-900/95 dark:bg-[#070B19]/95 text-white text-[11px] px-2.5 py-1 rounded-xl shadow-xl border border-white/15 backdrop-blur-md flex items-center gap-2 animate-in fade-in duration-150">
                    <span className="text-slate-300">{item.categoryName}:</span>
                    <span className="font-mono font-bold text-blue-300">{item.formattedValue} {unit}</span>
                    <span className="text-slate-400">({widthPercent}% من المصدر الأعلى)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* جدول مقارنة تفصيلي */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-bold">
                <th className="p-3">الفئة / المصدر</th>
                <th className="p-3">القيمة الرقمية</th>
                <th className="p-3">النسبة من الإجمالي</th>
                <th className="p-3">النسبة من الأعلى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {items.map((item) => {
                const relativeToMax = Math.round((item.primaryValue / maxVal) * 100);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.id)}
                        <span>{item.categoryName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.formattedValue}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-bold border border-blue-200 dark:border-blue-800/60">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                      {relativeToMax}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. ملخص توضيحي */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="font-semibold">
          إجمالي استفسارات الفئات المعروضة:{" "}
          <strong className="text-slate-900 dark:text-white font-mono font-bold">
            {totalVal.toLocaleString()} {unit}
          </strong>
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          المصدر الأعلى اعتماداً: <strong className="text-blue-600 dark:text-blue-400">{items[0]?.categoryName}</strong>
        </span>
      </div>
    </div>
  );
}
