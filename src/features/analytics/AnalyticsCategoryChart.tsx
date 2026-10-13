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

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "cat-db":
        return <Database className="w-4 h-4 text-blue-600" />;
      case "cat-sheets":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case "cat-docs":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Layers className="w-4 h-4 text-cyan-600" />;
    }
  };

  const maxVal = Math.max(...items.map((i) => i.primaryValue), 1);
  const totalVal = items.reduce((sum, i) => sum + i.primaryValue, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. الترويسة والتبديل */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              مقارنة فئات
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {description} • <span className="font-semibold text-slate-700">الوحدة: {unit}</span>
          </p>
        </div>

        {/* أزرار التبديل */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("bars")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "bars"
                ? "bg-white text-blue-700 shadow-2xs border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900"
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
                ? "bg-white text-blue-700 shadow-2xs border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>جدول مقارنة</span>
          </button>
        </div>
      </div>

      {/* 2. المحتوى: أشرطة بيانية أو جدول تفصيلي */}
      {viewMode === "bars" ? (
        <div className="space-y-4 pt-1">
          {items.map((item) => {
            const widthPercent = Math.round((item.primaryValue / maxVal) * 100);

            return (
              <div key={item.id} className="space-y-1.5">
                {/* اسم الفئة والقيم */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.id)}
                    </div>
                    <span className="font-bold text-slate-800">
                      {item.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      {item.formattedValue}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {item.badgeLabel}
                    </span>
                  </div>
                </div>

                {/* شريط التقدم الشريطي */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-l from-blue-600 to-indigo-600"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* جدول مقارنة تفصيلي */
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3">الفئة / المصدر</th>
                <th className="p-3">القيمة الرقمية</th>
                <th className="p-3">النسبة من الإجمالي</th>
                <th className="p-3">النسبة من الأعلى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const relativeToMax = Math.round((item.primaryValue / maxVal) * 100);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.id)}
                        <span>{item.categoryName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700">
                      {item.formattedValue}
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">
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
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="font-semibold">
          إجمالي استفسارات الفئات المعروضة:{" "}
          <strong className="text-slate-900 font-mono font-bold">
            {totalVal.toLocaleString()} {unit}
          </strong>
        </span>
        <span className="text-[11px] text-slate-500">
          المصدر الأعلى اعتماداً: <strong className="text-blue-700">{items[0]?.categoryName}</strong>
        </span>
      </div>
    </div>
  );
}
